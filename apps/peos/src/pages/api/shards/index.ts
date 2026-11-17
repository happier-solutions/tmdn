import type { APIRoute } from 'astro';
import { db, error, sameOrigin } from '../../../lib/api';

// All shards of the user, data inlined as raw JSON (already validated on write).
export const GET: APIRoute = async ({ locals }) => {
	const { results } = await db().prepare('select "id", "data", "t" from "shard" where "userId" = ?').bind(locals.user.id).all<{ id: string; data: string; t: number }>();
	const body = `{"shards":[${results.map((r) => `{"id":${JSON.stringify(r.id)},"t":${r.t},"data":${r.data}}`).join(',')}]}`;
	return new Response(body, { headers: { 'content-type': 'application/json' } });
};

// "Xóa tất cả dữ liệu": every shard, snapshots included. The plan stays.
export const DELETE: APIRoute = async (ctx) => {
	if (!sameOrigin(ctx)) return error('bad_origin', 403);
	await db().prepare('delete from "shard" where "userId" = ?').bind(ctx.locals.user.id).run();
	return new Response(null, { status: 204 });
};
