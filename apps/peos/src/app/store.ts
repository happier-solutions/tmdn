import { useSyncExternalStore } from 'react';
import type { Plan, State, Task } from './types';

// One mutable state object, like the spec. Writers mutate it, then call save() or emit();
// every subscriber re-renders on the version bump.
export let S: State;
export let P: Plan;
export let TASKMAP: Record<string, Task> = {};
export let DAILY: Task[] = [];
export let COMPNAME: Record<string, string> = {};
let uid = '';
let version = 0;
const listeners = new Set<() => void>();

const skeleton = (): State => ({
	v: 1,
	start: '',
	planStart: '',
	stageOverride: '',
	star: ['', '', ''],
	days: {},
	lib: {},
	reviews: {},
	comps: {},
	evidence: [],
	gates: {},
	kpis: {},
	tracker: [],
	decisions: [],
	risks: [],
	notes: [],
	theme: '',
	lastExport: '',
	onboard: true,
	autoPri: true,
	autoReview: true,
	libD: {},
	libE: {},
	_t: {},
	_h: {},
});

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

export function merge<T extends object>(a: T, b: object): T {
	const out = a as Record<string, unknown>;
	for (const [k, v] of Object.entries(b)) {
		const cur = out[k];
		if (v && typeof v === 'object' && !Array.isArray(v) && cur && typeof cur === 'object' && !Array.isArray(cur)) {
			out[k] = merge(cur as object, v);
		} else out[k] = v;
	}
	return a;
}

export const defaults = (): State => merge(skeleton(), clone(P?.initial ?? {}));

export let storageOK = true;
const lsKey = () => `peos_v1:${uid}`;
export const conflictsKey = () => `peos_conflicts:${uid}`;

export function init(plan: Plan, userId: string) {
	P = plan;
	uid = userId;
	TASKMAP = Object.fromEntries(plan.tasks.map((t) => [t.id, t]));
	DAILY = plan.tasks.filter((t) => t.freq === 'daily');
	COMPNAME = Object.fromEntries(plan.comps.map((c) => [c.id, c.name]));
	S = defaults();
	try {
		const raw = localStorage.getItem(lsKey());
		if (raw) {
			const o = JSON.parse(raw);
			if (o && typeof o === 'object') S = merge(defaults(), o);
		}
	} catch {
		storageOK = false;
	}
}

export function replaceState(next: State) {
	S = next;
}

export function persistLocal() {
	try {
		localStorage.setItem(lsKey(), JSON.stringify(S));
	} catch {
		storageOK = false;
	}
}

export function emit() {
	version++;
	for (const l of listeners) l();
}
export function subscribe(l: () => void) {
	listeners.add(l);
	return () => listeners.delete(l);
}
export function useStore() {
	useSyncExternalStore(subscribe, () => version);
	return S;
}

// Sync hooks in, set by sync.ts, to avoid an import cycle.
let onSaved: () => void = () => {};
export const setOnSaved = (f: () => void) => {
	onSaved = f;
};

let saveT: ReturnType<typeof setTimeout> | undefined;
export function save() {
	clearTimeout(saveT);
	persistLocal();
	onSaved();
	emit();
}
// Typing: re-render now, write to storage and sync a moment later.
export function saveSoon() {
	emit();
	clearTimeout(saveT);
	saveT = setTimeout(save, 300);
}

export function setPath(path: string, val: unknown) {
	const p = path.split('|');
	let o = S as unknown as Record<string, unknown>;
	for (let i = 0; i < p.length - 1; i++) {
		if (typeof o[p[i]] !== 'object' || o[p[i]] === null) o[p[i]] = {};
		o = o[p[i]] as Record<string, unknown>;
	}
	o[p[p.length - 1]] = val;
}
export function getPath(path: string): unknown {
	let o: unknown = S;
	for (const k of path.split('|')) {
		if (o == null) return undefined;
		o = (o as Record<string, unknown>)[k];
	}
	return o;
}

export function applyTheme() {
	const r = document.documentElement;
	if (S.theme) r.setAttribute('data-theme', S.theme);
	else r.removeAttribute('data-theme');
}
