# tmdn

Turborepo + pnpm workspaces monorepo.

| App | Path | Stack |
|---|---|---|
| Site | `apps/web` | Astro 7, Sveltia CMS, Cloudflare Pages |
| PEOS | `apps/peos` | Astro 7 + React, Cloudflare Workers, D1, Better Auth. See `apps/peos/README.md` |

## Development

```sh
pnpm install
pnpm dev                 # every app
pnpm --filter web dev    # one app
pnpm build               # turbo, cached
```

The CMS is at `/admin/index.html`, configured in `apps/web/public/admin/config.yml`; its folders are repo-relative, so they start with `apps/web/`.

## Content

Paths below are relative to `apps/web`. Each post is a folder `src/content/posts/<slug>/` with an `index.md` and its images. A post has one `topic`, and its pillar comes from that topic. Pillars, topics and tags live in `src/data/taxonomy.json` (editable in the CMS). The build fails if a post uses an unknown topic or tag.

See `docs/plan.md` for the project plan and `DESIGN.md` for the design system.

## Deploy

GitHub Actions (`.github/workflows/ci.yml`) builds every push and PR. Pushes to `main` deploy to Cloudflare Pages (project `tmdn`) via `pnpm --filter web run deploy` (`wrangler pages deploy dist` in `apps/web`). The Node version comes from `.node-version`.

Required repo secrets: `CLOUDFLARE_API_TOKEN` (Account > Cloudflare Pages > Edit) and `CLOUDFLARE_ACCOUNT_ID`. Turn off automatic deployments in Cloudflare (Settings > Builds & deployments) to avoid double builds.

## CMS login

Choose "Sign In with Token" and use a fine-grained PAT owned by `happier-solutions`, limited to the `tmdn` repo, with read/write access to Contents and Pull requests.
