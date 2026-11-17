import type { APIRoute } from 'astro';
import { MAX_SHARD, db, error, json, readJson, sameOrigin } from '../../../lib/api';

// The only shard ids the client writes (see src/app/sync.ts).
const ID = /^(core|ops|journal|d-\d{4}-\d{2}|rv-\d{4}|snap-[0-3]-(core|ops|journal))$/;

export const PUT: APIRoute = async (ctx) => {
	const id = ctx.params.id ?? '';
	if (!ID.test(id)) return error('bad_id', 400);
	if (!sameOrigin(ctx)) return error('bad_origin', 403);
	const body = await readJson(ctx, MAX_SHARD);
	if (body instanceof Response) return body;
	const t = body._t;
	if (typeof t !== 'number' || !Number.isFinite(t)) return error('bad_t', 400);
	// Optimistic concurrency: x-base-t is the version the client last saw (0 = none). If the stored
	// shard moved on since, refuse with 409 so the client pulls, stashes its copy and applies the newer one.
	// Snapshots send no header and always overwrite.
	const baseHeader = ctx.request.headers.get('x-base-t');
	const base = baseHeader == null ? null : Number(baseHeader);
	if (base != null && !Number.isFinite(base)) return error('bad_base', 400);
	const res = await db()
		.prepare(
			'insert into "shard" ("userId", "id", "data", "t") values (?1, ?2, ?3, ?4) on conflict ("userId", "id") do update set "data" = ?3, "t" = ?4 where ?5 is null or "shard"."t" = ?5',
		)
		.bind(ctx.locals.user.id, id, JSON.stringify(body), t, base)
		.run();
	if (!res.meta.changes) return error('conflict', 409);
	return json({ ok: true });
};

export const DELETE: APIRoute = async (ctx) => {
	const id = ctx.params.id ?? '';
	if (!ID.test(id)) return error('bad_id', 400);
	if (!sameOrigin(ctx)) return error('bad_origin', 403);
	await db().prepare('delete from "shard" where "userId" = ? and "id" = ?').bind(ctx.locals.user.id, id).run();
	return new Response(null, { status: 204 });
};
