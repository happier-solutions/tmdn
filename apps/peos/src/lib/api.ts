import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';

export const db = () => env.DB;
export const MAX_SHARD = 240_000;
export const MAX_PLAN = 1_000_000;

export const json = (data: unknown, status = 200) => Response.json(data, { status });
export const error = (code: string, status: number) => json({ error: code }, status);

// Writes must come from this origin. JSON bodies already force a CORS preflight; this is a second lock.
export function sameOrigin(ctx: APIContext) {
	const origin = ctx.request.headers.get('origin');
	return origin === ctx.url.origin;
}

// Reads a JSON object body up to `max` characters.
export async function readJson(ctx: APIContext, max: number): Promise<Record<string, unknown> | Response> {
	const text = await ctx.request.text();
	if (text.length > max) return error('too_large', 413);
	try {
		const v = JSON.parse(text);
		if (!v || typeof v !== 'object' || Array.isArray(v)) return error('bad_json', 400);
		return v;
	} catch {
		return error('bad_json', 400);
	}
}
