import { addDays, diffDays, fmtS, inRange, iso, monday, numv, pad, parse, todayISO } from './dates';
import { DAILY, P, S, TASKMAP, save, setPath } from './store';
import type { Day, Task } from './types';

export const STATUS = ['Chưa bắt đầu', 'Đang làm', 'Xong'];
const REPEATING = ['daily', 'weekly', 'monthly', 'quarterly', 'event'];

export function curStage() {
	if (S.stageOverride !== '' && S.stageOverride != null) return +S.stageOverride;
	if (!S.start) return 0;
	const t = parse(todayISO());
	const st = parse(S.start);
	if (t < st) return 0;
	const d = diffDays(t, st);
	return d < 91 ? 1 : d < 183 ? 2 : d < 365 ? 3 : d < 730 ? 4 : 5;
}
export function planWeek() {
	if (!S.planStart) return 1;
	const w = Math.floor(diffDays(parse(todayISO()), parse(S.planStart)) / 7) + 1;
	return Math.max(1, Math.min(11, w));
}
export function learnSuggestion() {
	if (curStage() === 0) {
		const w = planWeek();
		const f = P.phase0Focus.find((x) => w >= x.from && w <= x.to);
		if (f) return `Tuần ${w}/11: ${f.text}`;
	}
	return P.learnFallback;
}
export const dayObj = (i: string): Day => S.days[i] || {};
export function status(id: string) {
	const t = TASKMAP[id];
	if (t && REPEATING.includes(t.freq)) return 'Lặp lại';
	return S.lib[id] || 'Chưa bắt đầu';
}
export function dayScore(i: string) {
	const o = S.days[i];
	if (!o) return null;
	const t = o.tasks || {};
	const c = DAILY.filter((k) => t[k.id]).length;
	const pr = o.pri || {};
	let d = 0;
	for (let j = 0; j < 3; j++) if (pr[j]?.d) d++;
	if (!c && !d && !o.note && !o.learnMin) return null;
	return (c + d) / (DAILY.length + 3);
}
export function weekMin(m: Date) {
	let s = 0;
	for (let i = 0; i < 7; i++) s += numv(S.days[iso(addDays(m, i))]?.learnMin);
	return s;
}
export function doneInRange(id: string, a: Date, b: Date) {
	for (let x = new Date(a); x <= b; x = addDays(x, 1)) if (S.days[iso(x)]?.tasks?.[id]) return true;
	return false;
}
export const overdueCount = () => {
	const t = todayISO();
	return S.tracker.filter((r) => r.due && r.due < t && r.st !== 'Xong').length;
};
export function learnTarget(): [number, number] {
	if (S.start) {
		const d = diffDays(parse(todayISO()), parse(S.start));
		if (d >= 0 && d < 56) return [300, 360];
	}
	return [480, 600];
}
export function backupDue() {
	const has = Object.keys(S.days).length > 3 || S.evidence.length || S.tracker.length || S.notes.length;
	if (!has) return false;
	if (!S.lastExport) return true;
	return diffDays(parse(todayISO()), parse(S.lastExport)) > 7;
}
export function onTimeRate() {
	const rows = S.tracker.filter((r) => r.st === 'Xong' && r.due && r.done);
	if (!rows.length) return null;
	return Math.round((rows.filter((r) => r.done <= r.due).length / rows.length) * 100);
}
export function autoMetrics() {
	const t0 = parse(todayISO());
	let cnt = 0;
	let sum = 0;
	for (let i = 0; i < 28; i++) {
		const sc = dayScore(iso(addDays(t0, -i)));
		if (sc != null) {
			cnt++;
			sum += sc;
		}
	}
	const ym = todayISO().slice(0, 7);
	const lim = iso(addDays(t0, -30));
	return {
		days: cnt,
		avg: cnt ? Math.round((sum / cnt) * 100) : null,
		ot: onTimeRate(),
		od: overdueCount(),
		rodd: S.risks.filter((r) => r.due && r.due < todayISO() && r.st !== 'Đã đóng').length,
		ev: S.evidence.filter((e) => e.d.slice(0, 7) === ym).length,
		dec: S.decisions.filter((x) => x.d && x.d >= lim).length,
		wm: weekMin(monday(t0)),
		tg: learnTarget(),
	};
}

export interface Period {
	key: string;
	label: string;
	prev: string;
	next: string;
	start: Date;
	end: Date;
}
export function periodFor(tab: 'w' | 'm' | 'q', ds: string): Period {
	const d = parse(ds);
	const y = d.getFullYear();
	if (tab === 'w') {
		const m = monday(d);
		return { key: `w_${iso(m)}`, label: `Tuần ${fmtS(iso(m))} – ${fmtS(iso(addDays(m, 6)))}`, prev: iso(addDays(m, -7)), next: iso(addDays(m, 7)), start: m, end: addDays(m, 6) };
	}
	if (tab === 'm') {
		return {
			key: `m_${y}-${pad(d.getMonth() + 1)}`,
			label: `Tháng ${d.getMonth() + 1}/${y}`,
			prev: iso(new Date(y, d.getMonth() - 1, 1)),
			next: iso(new Date(y, d.getMonth() + 1, 1)),
			start: new Date(y, d.getMonth(), 1),
			end: new Date(y, d.getMonth() + 1, 0),
		};
	}
	const q = Math.floor(d.getMonth() / 3);
	return {
		key: `q_${y}-Q${q + 1}`,
		label: `Quý ${q + 1}/${y}`,
		prev: iso(new Date(y, (q - 1) * 3, 1)),
		next: iso(new Date(y, (q + 1) * 3, 1)),
		start: new Date(y, q * 3, 1),
		end: new Date(y, q * 3 + 3, 0),
	};
}

export function reviewEmpty(key: string) {
	const r = S.reviews[key];
	return !r || !Object.keys(r).some((k) => k !== '_auto' && String(r[k]).trim());
}
function weekHasLog(pi: Period) {
	for (let x = new Date(pi.start); x <= pi.end; x = addDays(x, 1)) if (dayScore(iso(x)) != null) return true;
	return false;
}
export function reviewDue() {
	const t = parse(todayISO());
	const wd = t.getDay();
	const out: string[] = [];
	if ((wd === 5 || wd === 6 || wd === 0) && reviewEmpty(periodFor('w', iso(t)).key)) out.push('Review tuần này');
	if (wd >= 1 && wd <= 3) {
		const pp = periodFor('w', iso(addDays(t, -7)));
		if (weekHasLog(pp) && reviewEmpty(pp.key)) out.push('Review tuần trước');
	}
	if (t.getDate() >= 26 && reviewEmpty(periodFor('m', iso(t)).key)) out.push('Review tháng');
	if (t.getDate() >= 26 && (t.getMonth() + 1) % 3 === 0 && reviewEmpty(periodFor('q', iso(t)).key)) out.push('Review quý');
	return out;
}

const isStageTask = (t: Task, st: number) => (t.freq === 'phase' && st === 0) || (t.freq === 'd90' && st === 1);
export const stageTasks = () => {
	const st = curStage();
	return P.tasks.filter((t) => isStageTask(t, st));
};
export const stageOpenTasks = () => stageTasks().filter((t) => status(t.id) !== 'Xong');

export function weakest() {
	const arr = P.comps.map((c) => {
		const u = S.comps[c.id];
		const v = u && u.cur != null ? u.cur : c.base;
		return { id: c.id, n: c.name, v, t: c.t12, gap: c.t12 - (v == null ? 1 : v), na: v == null };
	});
	arr.sort((a, b) => b.gap - a.gap || +b.na - +a.na);
	return arr.slice(0, 5);
}
export const compLevel = (id: string) => {
	const u = S.comps[id];
	return u && u.cur != null ? u.cur : (P.comps.find((c) => c.id === id)?.base ?? null);
};

// Bulleted list for review drafts, at most 8 lines.
function bl(arr: (string | undefined | false)[]) {
	const xs = arr.filter((x): x is string => !!x && !!String(x).trim());
	if (!xs.length) return '';
	const out = xs.slice(0, 8).map((x) => `• ${x}`);
	if (xs.length > 8) out.push(`• …và ${xs.length - 8} mục khác`);
	return out.join('\n');
}

function libDoneIn(a: Date, b: Date) {
	return P.tasks.filter((t) => S.libD[t.id] && inRange(S.libD[t.id], a, b) && status(t.id) === 'Xong').map((t) => `${t.id} ${t.name}`);
}

function draftWeek(pi: Period): Record<string, string> {
	const { start: a, end: b } = pi;
	const doneP: string[] = [];
	const undoneP: string[] = [];
	const learn: string[] = [];
	for (let x = new Date(a); x <= b; x = addDays(x, 1)) {
		const o = S.days[iso(x)];
		if (!o) continue;
		const tag = ` (${pad(x.getDate())}/${pad(x.getMonth() + 1)})`;
		for (let i = 0; i < 3; i++) {
			const p = o.pri?.[i];
			if (p?.t) (p.d ? doneP : undoneP).push(p.t + tag);
		}
		if (o.learn && String(o.learn).trim()) learn.push(String(o.learn).trim().split('\n')[0] + tag);
	}
	const tr = S.tracker;
	const trDone = tr.filter((r) => r.st === 'Xong' && r.done && r.t && inRange(r.done, a, b)).map((r) => r.t);
	const trOpen = tr.filter((r) => r.t && r.st !== 'Xong' && r.due && r.due <= iso(b)).map((r) => `${r.t} (hạn ${fmtS(r.due)})`);
	const decs = S.decisions.filter((r) => r.d && r.t && inRange(r.d, a, b)).map((r) => `Quyết định đã hỗ trợ: ${r.t}`);
	const evs = S.evidence.filter((e) => inRange(e.d, a, b));
	const fb = evs.filter((e) => e.type === P.roles.feedback).map((e) => e.title);
	const other = evs.filter((e) => e.type !== P.roles.feedback).map((e) => e.title);
	const rc = S.risks.filter((r) => r.st === 'Đã đóng' && r.done && r.t && inRange(r.done, a, b)).map((r) => `Đã đóng rủi ro: ${r.t}`);
	const nt = S.notes.filter((n) => inRange(n.d, a, b)).map((n) => `Ghi chú: ${n.title} (${n.dom})`);
	const n1 = addDays(b, 1);
	const n2 = addDays(b, 7);
	const trNext = tr.filter((r) => r.t && r.st !== 'Xong' && r.due && inRange(r.due, n1, n2)).map((r) => `${r.t} (hạn ${fmtS(r.due)})`);
	const openS = stageOpenTasks().slice(0, 3).map((t) => `${t.id} ${t.name}`);
	return {
		done: bl([...doneP, ...trDone, ...libDoneIn(a, b)]),
		notdone: bl([...undoneP, ...trOpen]),
		why: '',
		ceo: bl([...fb, ...decs]),
		biz: bl(other),
		solved: bl([...trDone, ...rc]),
		learn: bl([...nt, ...learn]),
		next: bl([...trNext, ...openS]),
	};
}

function draftMonth(pi: Period): Record<string, string> {
	const { start: a, end: b } = pi;
	const tr = S.tracker;
	const evs = S.evidence.filter((e) => inRange(e.d, a, b));
	const nts = (doms: string[]) => S.notes.filter((n) => inRange(n.d, a, b) && doms.includes(n.dom)).map((n) => `Ghi chú: ${n.title}`);
	const done = tr.filter((r) => r.st === 'Xong' && r.done && inRange(r.done, a, b));
	const ontime = done.filter((r) => r.due && r.done <= r.due).length;
	const wd = done.filter((r) => r.due).length;
	let mins = 0;
	for (let x = new Date(a); x <= b; x = addDays(x, 1)) mins += numv(S.days[iso(x)]?.learnMin);
	const comps = P.comps
		.filter((c) => {
			const u = S.comps[c.id];
			return u?.d && inRange(u.d, a, b);
		})
		.map((c) => {
			const u = S.comps[c.id];
			return `${c.name}: ${u.cur == null ? 'chưa đủ bằng chứng' : `Level ${u.cur}`}${u.ev ? ` (${u.ev})` : ''}`;
		});
	const openN = tr.filter((r) => r.st !== 'Xong').length;
	const md = P.roles.monthDomains;
	return {
		trust: bl([...evs.filter((e) => e.type === P.roles.feedback).map((e) => e.title), wd ? `Việc xong có deadline: ${wd}, đúng hạn ${ontime} (${Math.round((ontime / wd) * 100)}%)` : '']),
		biz: bl([...nts(md.biz), ...evs.filter((e) => e.type === P.roles.value).map((e) => e.title)]),
		fin: bl([...nts(md.fin), `Tổng thời gian học trong tháng: ${(mins / 60).toFixed(1)} giờ`]),
		rob: bl(nts(md.rob)),
		proj: bl([...libDoneIn(a, b), done.length ? `Việc Tracker đã xong: ${done.length}` : '', openN ? `Việc Tracker còn mở: ${openN}` : '']),
		comp: bl(comps),
		adj: '',
	};
}

function draftQuarter(pi: Period): Record<string, string> {
	const { start: a, end: b } = pi;
	const st = curStage();
	const stT = stageTasks();
	const stD = stT.filter((t) => status(t.id) === 'Xong').length;
	const m = autoMetrics();
	const gates = P.gates.map((g) => `${g.id}: ${g.criteria.filter((_, j) => S.gates[`${g.id}_${j}`]).length}/${g.criteria.length} điều kiện`);
	const own = [
		...P.roles.ownershipTasks.filter((id) => TASKMAP[id]).map((id) => `${id} ${TASKMAP[id].name}: ${status(id)}`),
		...S.evidence.filter((e) => inRange(e.d, a, b) && e.type === P.roles.ownership).map((e) => e.title),
	];
	const wk = weakest()
		.slice(0, 3)
		.map((x) => x.n + (x.na ? ': chưa đủ bằng chứng' : `: Level ${x.v} → ${x.t}`));
	return {
		prog: bl([
			P.stages[st]?.name,
			stT.length ? `Việc của giai đoạn: ${stD}/${stT.length} xong` : '',
			m.avg == null ? '' : `Mức hoàn thành trung bình 28 ngày: ${m.avg}%`,
			`Bằng chứng ghi trong quý: ${S.evidence.filter((e) => inRange(e.d, a, b)).length}`,
		]),
		gate: bl(gates),
		own: bl(own),
		up: bl(wk),
		plan: bl(S.star.filter(Boolean)),
	};
}

// Fills only the empty fields of a review from the user's data.
export function autoDraft(pi: Period) {
	const k0 = pi.key.charAt(0);
	const d = k0 === 'w' ? draftWeek(pi) : k0 === 'm' ? draftMonth(pi) : draftQuarter(pi);
	const r = S.reviews[pi.key] || {};
	let any = false;
	for (const k of Object.keys(d)) {
		if (d[k] && !(r[k] && String(r[k]).trim())) {
			r[k] = d[k];
			any = true;
		}
	}
	if (any) {
		r._auto = true;
		S.reviews[pi.key] = r;
		save();
	}
	return any;
}

export function hasPriText(day: Day) {
	for (let i = 0; i < 3; i++) if (day.pri?.[i]?.t && String(day.pri[i].t).trim()) return true;
	return false;
}
export function suggestPri(ds: string) {
	const out: string[] = [];
	const seen = new Set<string>();
	const add = (x0: string) => {
		const x = String(x0 || '').trim();
		const k = x.toLowerCase();
		if (x && !seen.has(k) && out.length < 8) {
			seen.add(k);
			out.push(x);
		}
	};
	for (let b = 1; b <= 3; b++) {
		const po = S.days[iso(addDays(parse(ds), -b))];
		if (po?.pri) {
			for (let j = 0; j < 3; j++) {
				const p = po.pri[j];
				if (p?.t && !p.d) add(p.t);
			}
			break;
		}
	}
	const rank: Record<string, number> = { Cao: 0, 'Trung bình': 1, Thấp: 2 };
	const lim = iso(addDays(parse(ds), 2));
	S.tracker
		.filter((r) => r.t && r.st !== 'Xong' && r.due && r.due <= lim)
		.sort((a, c) => (a.due < c.due ? -1 : a.due > c.due ? 1 : 0) || (rank[a.imp] ?? 1) - (rank[c.imp] ?? 1))
		.forEach((r) => add(r.t + (r.out ? ` → ${r.out}` : '')));
	S.tracker.filter((r) => r.t && r.st !== 'Xong' && !r.due && r.imp === 'Cao').forEach((r) => add(r.t));
	stageOpenTasks()
		.slice(0, 3)
		.forEach((t) => add(`${t.id} ${t.name} → ${t.out}`));
	return out;
}
export function autoFillPriorities(ds: string) {
	const sg = suggestPri(ds);
	if (!sg.length) return;
	for (let q = 0; q < Math.min(3, sg.length); q++) setPath(`days|${ds}|pri|${q}|t`, sg[q]);
	setPath(`days|${ds}|_auto`, true);
	save();
}

// "Soạn báo cáo Q1 @Lan #25/11" -> task, owner, due date.
export function parseQuick(txt: string) {
	let o = '';
	let due = '';
	let t = txt;
	const m = t.match(/@([^#@]+?)(?=\s+#|\s+@|$)/);
	if (m) {
		o = m[1].trim();
		t = t.replace(m[0], '');
	}
	const d = t.match(/#(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{2,4}))?/);
	if (d) {
		const y = d[3] ? (+d[3] < 100 ? 2000 + +d[3] : +d[3]) : new Date().getFullYear();
		due = `${y}-${pad(+d[2])}-${pad(+d[1])}`;
		t = t.replace(d[0], '');
	}
	return { t: t.replace(/\s+/g, ' ').trim(), o, due };
}

export function milestoneDates(): [string, Date][] {
	if (!S.start) return [];
	const s = parse(S.start);
	return [
		['Ngày bắt đầu', s],
		['Ngày 30', addDays(s, 30)],
		['Ngày 60', addDays(s, 60)],
		['Ngày 90 – cổng ownership', addDays(s, 90)],
		['Tháng 6', addDays(s, 182)],
		['Tháng 12', addDays(s, 364)],
	];
}
