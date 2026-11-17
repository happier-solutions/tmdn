// Shard sync with D1 through /api/shards. Same protocol as the spec: the state splits into
// shards; a shard whose remote `_t` is newer than ours replaces the local one, and local edits it
// overwrites go to a conflict stash. D1 has no live listener, so we pull on focus and every minute.
import { S, conflictsKey, defaults, emit, persistLocal, replaceState, setOnSaved } from './store';
import type { State } from './types';

type Shard = Record<string, unknown>;
type Remote = { id: string; data: Shard; t: number };

export const sync = {
	st: 'pulling' as 'pulling' | 'saving' | 'ok' | 'error' | 'offline',
	err: '',
	last: '',
	busy: false,
	ready: false,
	snaps: {} as Record<string, { kind: string; t: number; data: Shard }>,
};

const MAX = 240000;
const CORE_EXCL = new Set(['days', 'reviews', 'tracker', 'decisions', 'risks', 'notes', 'evidence']);

export function stable(o: unknown): string {
	if (o === null || typeof o !== 'object') return JSON.stringify(o);
	if (Array.isArray(o)) return `[${o.map(stable).join(',')}]`;
	return `{${Object.keys(o)
		.sort()
		.map((k) => `${JSON.stringify(k)}:${stable((o as Shard)[k])}`)
		.join(',')}}`;
}
function hash(str: string) {
	let h = 5381;
	for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
	return `${h}:${str.length}`;
}
const yearOf = (k: string) => (k.match(/\d{4}/) || ['0000'])[0];

export function shardsOf(st: State = S): Record<string, Shard> {
	const out: Record<string, Shard> = {};
	const core: Shard = {};
	for (const k of Object.keys(st)) if (k.charAt(0) !== '_' && !CORE_EXCL.has(k)) core[k] = (st as unknown as Shard)[k];
	out.core = core;
	out.ops = { tracker: st.tracker || [], decisions: st.decisions || [], risks: st.risks || [] };
	out.journal = { evidence: st.evidence || [], notes: st.notes || [] };
	for (const k of Object.keys(st.days || {})) {
		const id = `d-${k.slice(0, 7)}`;
		((out[id] ??= { days: {} }).days as Shard)[k] = st.days[k];
	}
	for (const k of Object.keys(st.reviews || {})) {
		const id = `rv-${yearOf(k)}`;
		((out[id] ??= { reviews: {} }).reviews as Shard)[k] = st.reviews[k];
	}
	return out;
}

export function applyShard(id: string, data: Shard) {
	const d = JSON.parse(JSON.stringify(data));
	delete d._t;
	const s = S as unknown as Shard;
	if (id === 'core') Object.assign(s, d);
	else if (id === 'ops') {
		S.tracker = d.tracker || [];
		S.decisions = d.decisions || [];
		S.risks = d.risks || [];
	} else if (id === 'journal') {
		S.evidence = d.evidence || [];
		S.notes = d.notes || [];
	} else if (id.startsWith('d-')) {
		const ym = id.slice(2);
		for (const x of Object.keys(S.days)) if (x.slice(0, 7) === ym) delete S.days[x];
		Object.assign(S.days, d.days || {});
	} else if (id.startsWith('rv-')) {
		const yr = id.slice(3);
		for (const x of Object.keys(S.reviews)) if (yearOf(x) === yr) delete S.reviews[x];
		Object.assign(S.reviews, d.reviews || {});
	}
}

export interface Conflict {
	id: string;
	t: number;
	shard: Shard;
}
export function getConflicts(): Conflict[] {
	try {
		return JSON.parse(localStorage.getItem(conflictsKey()) || '[]');
	} catch {
		return [];
	}
}
export function setConflicts(a: Conflict[]) {
	try {
		if (a.length) localStorage.setItem(conflictsKey(), JSON.stringify(a));
		else localStorage.removeItem(conflictsKey());
	} catch {}
}
function stashConflict(id: string, shard: Shard) {
	const a = getConflicts();
	a.push({ id, t: Date.now(), shard });
	while (a.length > 6) a.shift();
	setConflicts(a);
}

/* ---------- API ---------- */
class HttpError extends Error {
	constructor(public code: string) {
		super(code);
	}
}
async function api(path: string, init?: RequestInit): Promise<any> {
	let res: Response;
	try {
		res = await fetch(path, { ...init, headers: { 'content-type': 'application/json', ...init?.headers } });
	} catch {
		throw new HttpError('unavailable');
	}
	if (res.status === 401) {
		location.href = '/login/';
		throw new HttpError('unauthenticated');
	}
	if (!res.ok) throw new HttpError(res.status === 409 ? 'conflict' : res.status === 413 ? 'too_large' : res.status >= 500 ? 'unavailable' : `http_${res.status}`);
	return res.status === 204 ? null : res.json();
}
const getAll = async (): Promise<Remote[]> => (await api('/api/shards')).shards;
// base: the remote version this edit started from; the server refuses the write if it moved on.
const put = (id: string, body: Shard, base?: number) =>
	api(`/api/shards/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(body), headers: base == null ? {} : { 'x-base-t': String(base) } });
const del = (id: string) => api(`/api/shards/${encodeURIComponent(id)}`, { method: 'DELETE' });
export const delAll = () => api('/api/shards', { method: 'DELETE' });

/* ---------- Pull and push ---------- */
function pull(remote: Remote[]) {
	let changed = false;
	const local = shardsOf();
	const def = shardsOf(defaults());
	for (const r of remote) {
		if (r.id.startsWith('snap-')) {
			sync.snaps[r.id] = { kind: r.data.kind as string, t: r.t, data: r.data.data as Shard };
			continue;
		}
		const lt = S._t?.[r.id] || 0;
		if (r.t <= lt) continue;
		const ls = local[r.id] ? stable(local[r.id]) : null;
		let dirty = false;
		if (ls !== null) {
			if (S._h?.[r.id] !== undefined) dirty = hash(ls) !== S._h[r.id];
			else dirty = !def[r.id] || stable(def[r.id]) !== ls;
		}
		if (dirty) stashConflict(r.id, local[r.id]);
		applyShard(r.id, r.data);
		S._t ??= {};
		S._h ??= {};
		S._t[r.id] = r.t;
		S._h[r.id] = hash(stable(shardsOf()[r.id] || {}));
		changed = true;
	}
	if (changed) persistLocal();
	return changed;
}

let retryT: ReturnType<typeof setTimeout> | undefined;
let conflictRetries = 0;
// force: overwrite regardless of the remote version (restoring a backup replaces everything).
export async function pushDirty(force = false): Promise<void> {
	if (!sync.ready || sync.busy) return;
	S._h ??= {};
	S._t ??= {};
	const sh = shardsOf();
	const ids = Object.keys(sh).filter((id) => hash(stable(sh[id])) !== S._h[id]);
	if (!ids.length) {
		if (sync.st !== 'ok') {
			sync.st = 'ok';
			sync.last ||= new Date().toISOString();
			emit();
		}
		return;
	}
	sync.busy = true;
	sync.st = 'saving';
	emit();
	try {
		for (const id of ids) {
			const t = Date.now();
			const body = { ...JSON.parse(JSON.stringify(sh[id])), _t: t };
			if (JSON.stringify(body).length > MAX) throw new HttpError('too_large');
			await put(id, body, force ? undefined : S._t[id] || 0);
			S._t[id] = t;
			S._h[id] = hash(stable(sh[id]));
		}
		sync.busy = false;
		conflictRetries = 0;
		sync.st = 'ok';
		sync.last = new Date().toISOString();
		persistLocal();
		emit();
		void maybeSnapshot();
		return pushDirty(force);
	} catch (e) {
		sync.busy = false;
		// Another device wrote first: take its shards (ours go to the conflict stash), then push the rest.
		if (e instanceof HttpError && e.code === 'conflict' && conflictRetries++ < 3) {
			await syncNow(true);
			return;
		}
		conflictRetries = 0;
		sync.st = 'error';
		sync.err = e instanceof HttpError ? e.code : 'unavailable';
		persistLocal();
		emit();
		if (sync.err === 'unavailable') {
			clearTimeout(retryT);
			retryT = setTimeout(() => void pushDirty(), 30000);
		}
	}
}

// Weekly copies of core, ops and journal, rotating over 4 slots.
async function maybeSnapshot() {
	const wk = Math.floor(Date.now() / 604800000);
	if (!sync.ready || S._snapWk === wk) return;
	const slot = wk % 4;
	const sh = shardsOf();
	try {
		for (const k of ['core', 'ops', 'journal']) {
			const body = { _t: Date.now(), kind: k, data: JSON.parse(JSON.stringify(sh[k])) };
			if (JSON.stringify(body).length > MAX) continue;
			await put(`snap-${slot}-${k}`, body);
		}
		S._snapWk = wk;
		persistLocal();
	} catch {}
}

let syncT: ReturnType<typeof setTimeout> | undefined;
const scheduleSync = () => {
	clearTimeout(syncT);
	syncT = setTimeout(() => void pushDirty(), 2000);
};

const isEditing = () => {
	const a = document.activeElement;
	return !!a && ['INPUT', 'TEXTAREA', 'SELECT'].includes(a.tagName);
};

// Pulls unless the user is typing: a remote shard would replace the field under the cursor.
export async function syncNow(force = false) {
	if (!force && (isEditing() || sync.busy)) return false;
	try {
		if (force) {
			sync.st = 'pulling';
			emit();
		}
		const changed = pull(await getAll());
		sync.ready = true;
		sync.st = 'ok';
		sync.last = new Date().toISOString();
		emit();
		await pushDirty();
		return changed;
	} catch (e) {
		sync.st = navigator.onLine ? 'error' : 'offline';
		sync.err = e instanceof HttpError ? e.code : 'unavailable';
		emit();
		return false;
	}
}

// After an import: drop remote shards the new state no longer has, then push.
export async function cloudPrune() {
	if (!sync.ready) return;
	try {
		const keep = shardsOf();
		const remote = await getAll();
		await Promise.all(remote.filter((r) => !r.id.startsWith('snap-') && !keep[r.id]).map((r) => del(r.id)));
	} catch {}
	await pushDirty(true);
}

export async function resetAll() {
	await delAll();
	replaceState(defaults());
	persistLocal();
	setConflicts([]);
	sync.snaps = {};
	scheduleSync();
	emit();
}

// Resolves after the first pull attempt, so views never act on stale local state.
export async function startSync() {
	setOnSaved(scheduleSync);
	await syncNow(true);
	const onFocus = () => {
		if (document.visibilityState === 'visible') void syncNow();
	};
	document.addEventListener('visibilitychange', onFocus);
	window.addEventListener('focus', onFocus);
	window.addEventListener('online', onFocus);
	setInterval(() => {
		if (document.visibilityState === 'visible') void syncNow();
	}, 60000);
}
