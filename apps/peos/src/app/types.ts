// Plan: the personal career plan, loaded from /api/plan. Never bundled.
export interface Task {
	id: string;
	name: string;
	freq: string;
	stage: string;
	pri: string;
	comp: string;
	auth: string;
	why: string;
	steps: string[];
	out: string;
	ok: string;
	kpi: string;
	min: number;
}

export interface Plan {
	version: 1;
	motto: string;
	stages: { name: string; span: string; short: string }[];
	freq: Record<string, string>;
	auth: Record<string, string>;
	comps: { id: string; name: string; base: number | null; t3: number; t12: number }[];
	kpis: { id: string; name: string; how: string; freq: string; source: string }[];
	gates: { id: string; title: string; criteria: string[]; notReady: string }[];
	phase0Focus: { from: number; to: number; text: string }[];
	tasks: Task[];
	reviewQuestions: Record<'w' | 'm' | 'q', [string, string][]>;
	evidenceTypes: string[];
	knowledgeDomains: string[];
	growthRisks: string[];
	gateBranches: string[];
	learnFallback: string;
	roles: {
		feedback: string;
		value: string;
		ownership: string;
		solved: string;
		shipped: string;
		ownershipTasks: string[];
		monthDomains: Record<'biz' | 'fin' | 'rob', string[]>;
	};
	initial: Partial<State>;
}

// State: the user's data, synced as shards to D1. Same shape as the spec's backup file.
export interface Priority {
	t?: string;
	d?: boolean;
}
export interface Day {
	tasks?: Record<string, boolean>;
	pri?: Record<string, Priority>;
	_auto?: boolean;
	ceo?: string;
	fu?: string;
	learn?: string;
	learnMin?: string;
	note?: string;
}
export interface TrackerRow {
	t: string;
	o: string;
	due: string;
	out: string;
	imp: string;
	st: string;
	done: string;
	evd?: boolean;
}
export interface DecisionRow {
	d: string;
	t: string;
	who: string;
	basis: string;
	next: string;
}
export interface RiskRow {
	t: string;
	lvl: string;
	o: string;
	due: string;
	mit: string;
	st: string;
	done: string;
}
export interface Evidence {
	id: string;
	d: string;
	type: string;
	title: string;
	sum: string;
	comp: string;
	task: string;
}
export interface Note {
	id: string;
	d: string;
	dom: string;
	title: string;
	body: string;
}
export type Review = Record<string, string | boolean>;

export interface State {
	v: 1;
	start: string;
	planStart: string;
	stageOverride: string;
	star: string[];
	days: Record<string, Day>;
	lib: Record<string, string>;
	reviews: Record<string, Review>;
	comps: Record<string, { cur: number | null; ev?: string; d?: string }>;
	evidence: Evidence[];
	gates: Record<string, boolean>;
	kpis: Record<string, { v?: string; e?: string }>;
	tracker: TrackerRow[];
	decisions: DecisionRow[];
	risks: RiskRow[];
	notes: Note[];
	theme: '' | 'light' | 'dark';
	lastExport: string;
	onboard: boolean;
	autoPri: boolean;
	autoReview: boolean;
	libD: Record<string, string>;
	libE: Record<string, boolean>;
	_t: Record<string, number>;
	_h: Record<string, string>;
	_snapWk?: number;
}
