#!/usr/bin/env node
// Extracts the plan (stages, tasks, KPIs, gates, initial state...) from the PEOS spec HTML into a
// plan JSON file. The plan is personal: keep the output out of git and upload it in the app
// (Dữ liệu > Kế hoạch). Usage: node scripts/extract-plan.mjs <spec.html> <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const [specPath, outPath] = process.argv.slice(2);
if (!specPath || !outPath) {
	console.error('Usage: node scripts/extract-plan.mjs <spec.html> <out.json>');
	process.exit(1);
}

const html = readFileSync(specPath, 'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!js) throw new Error('No inline <script> in the spec');

const slice = (from, to) => {
	const a = js.indexOf(from);
	const b = js.indexOf(to, a);
	if (a < 0 || b < 0) throw new Error(`Spec section not found: ${from}`);
	return js.slice(a, b);
};
const grab = (re, label) => {
	const m = js.match(re);
	if (!m) throw new Error(`Spec text not found: ${label}`);
	return m[1];
};

// Constants and the default state run as-is in a sandbox: no DOM, no storage.
const code = [
	slice('var STAGES=', 'var TASKMAP='),
	slice('function defaults(){', 'var S=defaults();'),
	slice('var REVQ=', 'function vReview('),
	slice('var EVTYPES=', 'function vEvidence('),
	slice('var KDOMS=', 'function vKnow('),
	'({STAGES,SHORT,FREQ,AUTH,STATUS,COMPS,KPIS,GATES,PHASE0_FOCUS,TASKS,REVQ,EVTYPES,KDOMS,initial:defaults()})',
].join('\n');
const c = vm.runInNewContext(code, {});

const strList = (src) => JSON.parse(src.replace(/'/g, '"'));
const listItems = (ol) => [...ol.matchAll(/<li>(.*?)<\/li>/g)].map((m) => m[1]);
const initial = { ...c.initial };
delete initial._t;
delete initial._h;

const plan = {
	version: 1,
	motto: grab(/<h1>Tổng quan<\/h1><div class="sub">“?(.*?)”?<\/div>/, 'motto'),
	stages: c.STAGES.map((s, i) => ({ name: s.n, span: s.s, short: c.SHORT[i] })),
	freq: c.FREQ,
	auth: c.AUTH,
	comps: c.COMPS.map(([id, name, base, t3, t12]) => ({ id, name, base, t3, t12 })),
	kpis: c.KPIS.map(([id, name, how, freq, source]) => ({ id, name, how, freq, source })),
	gates: c.GATES.map((g) => ({ id: g.n, title: g.t, criteria: g.c, notReady: g.x })),
	phase0Focus: c.PHASE0_FOCUS.map(([from, to, text]) => ({ from, to, text })),
	tasks: c.TASKS,
	reviewQuestions: c.REVQ,
	evidenceTypes: c.EVTYPES,
	knowledgeDomains: c.KDOMS,
	growthRisks: listItems(grab(/Rủi ro đối với sự phát triển<\/h2><ul[^>]*>(.*?)<\/ul>/, 'growth risks')),
	gateBranches: listItems(grab(/Nếu công ty không giao quyền<\/h3><ol[^>]*>(.*?)<\/ol>/, 'gate branches')),
	learnFallback: grab(/return '(Chọn chủ đề theo lộ trình học[^']*)'/, 'learn fallback'),
	// Hooks the automatic drafts and suggestions rely on, read from the spec's draft code.
	roles: {
		feedback: grab(/fb=evs\.filter\(function\(e\)\{return e\.type==='([^']+)'/, 'feedback type'),
		value: grab(/e\.type==='([^']+)';\}\)\.map\(function\(e\)\{return e\.title;\}\)\)\),\s*fin:/, 'value type'),
		ownership: grab(/inRange\(e\.d,a,b\)&&e\.type==='([^']+)'/, 'ownership type'),
		solved: grab(/S\.evidence\.push\(\{id:'EVD-'\+Date\.now\(\),d:todayISO\(\),type:'([^']+)',title:tr\.t/, 'solved type'),
		shipped: grab(/S\.evidence\.push\(\{id:'EVD-'\+Date\.now\(\),d:todayISO\(\),type:'([^']+)',title:tk\.id/, 'shipped type'),
		ownershipTasks: JSON.parse(grab(/var own=(\[[^\]]+\])\.map/, 'ownership tasks').replace(/'/g, '"')),
		monthDomains: {
			biz: strList(grab(/biz:bl\(nts\((\[[^\]]+\])\)/, 'biz domains')),
			fin: strList(grab(/fin:bl\(nts\((\[[^\]]+\])\)/, 'fin domains')),
			rob: strList(grab(/rob:bl\(nts\((\[[^\]]+\])\)/, 'rob domains')),
		},
	},
	initial,
};

for (const id of plan.roles.ownershipTasks) {
	if (!plan.tasks.some((t) => t.id === id)) throw new Error(`Unknown ownership task ${id}`);
}
for (const k of ['feedback', 'value', 'ownership', 'solved', 'shipped']) {
	if (!plan.evidenceTypes.includes(plan.roles[k])) throw new Error(`Unknown evidence type ${plan.roles[k]}`);
}

writeFileSync(outPath, JSON.stringify(plan, null, '\t') + '\n');
console.log(`Plan: ${plan.tasks.length} tasks, ${plan.comps.length} competencies, ${plan.gates.length} gates -> ${outPath}`);
