declare namespace App {
	interface Locals {
		user: import('better-auth').User;
		session: import('better-auth').Session;
	}
}

// Secrets live in .dev.vars or `wrangler secret`, so `wrangler types` can't always see them.
declare namespace Cloudflare {
	interface Env {
		BETTER_AUTH_SECRET: string;
		ALLOWED_EMAILS: string;
	}
}
