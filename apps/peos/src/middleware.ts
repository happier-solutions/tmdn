import { defineMiddleware } from 'astro:middleware';
import { getAuth } from './lib/auth';

const PUBLIC = ['/login', '/api/auth/'];

// Every page and API route needs a session, except the login page and the auth endpoints.
export const onRequest = defineMiddleware(async (ctx, next) => {
	const path = ctx.url.pathname;
	if (PUBLIC.some((p) => path === p || path === `${p}/` || (p.endsWith('/') && path.startsWith(p)))) return next();

	const res = await getAuth().api.getSession({ headers: ctx.request.headers });
	if (!res) {
		if (path.startsWith('/api/')) return Response.json({ error: 'unauthenticated' }, { status: 401 });
		return ctx.redirect('/login/');
	}
	ctx.locals.user = res.user;
	ctx.locals.session = res.session;
	const out = await next();
	// Personal data: never cache.
	out.headers.set('cache-control', 'private, no-store');
	return out;
});
