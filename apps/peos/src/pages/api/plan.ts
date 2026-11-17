import type { APIRoute } from 'astro';
import { MAX_PLAN, db, error, json, readJson, sameOrigin } from '../../lib/api';

export const GET: APIRoute = async ({ locals }) => {
	const row = await db().prepare('select "data" from "plan" where "userId" = ?').bind(locals.user.id).first<{ data: string }>();
	if (!row) return error('no_plan', 404);
	return new Response(`{"plan":${row.data}}`, { headers: { 'content-type': 'application/json' } });
};

export const PUT: APIRoute = async (ctx) => {
	if (!sameOrigin(ctx)) return error('bad_origin', 403);
	const plan = await readJson(ctx, MAX_PLAN);
	if (plan instanceof Response) return plan;
	if (plan.version !== 1 || !Array.isArray(plan.tasks) || !Array.isArray(plan.stages) || !Array.isArray(plan.comps)) return error('bad_plan', 400);
	await db()
		.prepare('insert into "plan" ("userId", "data", "updatedAt") values (?1, ?2, ?3) on conflict ("userId") do update set "data" = ?2, "updatedAt" = ?3')
		.bind(ctx.locals.user.id, JSON.stringify(plan), Date.now())
		.run();
	return json({ ok: true });
};
