# PEOS

Executive Career Command Center: a personal career tracker. Astro 7 + React on Cloudflare Workers, D1 for data, Better Auth (email + password) for sign-in.

## Data and privacy

- **Plan** (stages, tasks, competencies, KPIs, gates, initial state): one JSON per user in D1 (`plan` table), served by `/api/plan` after sign-in. It is personal, so it is **never in git or in the JS bundle**. Make one from the spec HTML with `node scripts/extract-plan.mjs <spec.html> <out.json>` (keep the output in `temp/`, which is ignored), then upload it in the app (first screen, or Dữ liệu > Kế hoạch).
- **State**: the spec's state object, split into shards (`core`, `ops`, `journal`, `d-YYYY-MM`, `rv-YYYY`, weekly `snap-N-*`) in the `shard` table, also cached in `localStorage`. Sync is last-writer-wins per shard by client timestamp; overwritten local edits go to a conflict stash (Dữ liệu). D1 has no live listener, so the app pulls on focus and every minute. The backup file format is the spec's, so spec backups import as-is.
- **Sign-up** is closed: only emails in the `ALLOWED_EMAILS` secret can create an account.
- Passwords use WebCrypto PBKDF2-SHA256 (100k iterations, the Workers maximum), native and much cheaper than JS scrypt. Not yet measured against the Free plan's 10 ms CPU limit: check sign-in after the first deploy.
- Writes are conditional: each shard PUT carries the version it started from (`x-base-t`), and the server answers 409 if another device wrote first.

## Development

```sh
cp .dev.vars.example .dev.vars   # fill BETTER_AUTH_SECRET and ALLOWED_EMAILS
pnpm db:migrate:local
pnpm astro dev --background      # http://localhost:4321
pnpm check                       # wrangler types + astro check
```

`scripts/auth-schema.mjs` prints the Better Auth schema; rerun it after upgrading Better Auth and diff with `migrations/0001_auth.sql`.

## Deploy (account TuMaDaiNhan)

D1 `peos`, the account and the custom domain `peos.tumadainhan.com` are set in `wrangler.jsonc`. Wrangler must be logged in with access to the TuMaDaiNhan account.

1. Secrets, once: `pnpm exec wrangler secret put BETTER_AUTH_SECRET` (value from `openssl rand -base64 32`) and `pnpm exec wrangler secret put ALLOWED_EMAILS` (comma-separated emails allowed to sign up).
2. `pnpm db:migrate:remote` when `migrations/` changes, then `pnpm run deploy`.
