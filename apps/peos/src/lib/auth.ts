import { betterAuth } from 'better-auth';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { env } from 'cloudflare:workers';
import { hashPassword, verifyPassword } from './password';

const allowed = () =>
	new Set(
		(env.ALLOWED_EMAILS || '')
			.split(',')
			.map((e) => e.trim().toLowerCase())
			.filter(Boolean),
	);

function create() {
	return betterAuth({
		database: env.DB,
		secret: env.BETTER_AUTH_SECRET,
		baseURL: env.BETTER_AUTH_URL,
		emailAndPassword: {
			enabled: true,
			minPasswordLength: 10,
			password: { hash: hashPassword, verify: verifyPassword },
		},
		// Cloudflare sets cf-connecting-ip and clients can't forge it, so rate limits are per client.
		advanced: { ipAddress: { ipAddressHeaders: ['cf-connecting-ip'] } },
		session: { expiresIn: 60 * 60 * 24 * 30, updateAge: 60 * 60 * 24 },
		rateLimit: { enabled: true, storage: 'database', window: 60, max: 30, customRules: { '/sign-in/email': { window: 60, max: 5 }, '/sign-up/email': { window: 60, max: 3 } } },
		// Closed registration: only emails in ALLOWED_EMAILS can create an account.
		hooks: {
			before: createAuthMiddleware(async (ctx) => {
				if (ctx.path !== '/sign-up/email') return;
				const email = String(ctx.body?.email ?? '')
					.trim()
					.toLowerCase();
				if (!allowed().has(email)) throw new APIError('FORBIDDEN', { message: 'Email này chưa được phép đăng ký.' });
			}),
		},
	});
}

// One instance per isolate: env is the same for every request of a deployment.
let auth: ReturnType<typeof create> | undefined;
export const getAuth = () => (auth ??= create());
