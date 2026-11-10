# tmdn

Built with Astro 7 and Sveltia CMS

## Development

```sh
pnpm install
pnpm dev
```

The CMS is at `/admin/index.html`, configured in `public/admin/config.yml`.

## Content

Each post is a folder `src/content/posts/<slug>/` with an `index.md` and its images. A post has one `topic`, and its pillar comes from that topic. Pillars, topics and tags live in `src/data/taxonomy.json` (editable in the CMS). The build fails if a post uses an unknown topic or tag.

See `docs/plan.md` for the project plan and `DESIGN.md` for the design system.

## Deploy

GitHub Actions (`.github/workflows/ci.yml`) builds every push and PR. Pushes to `main` deploy to Cloudflare Pages (project `tmdn`) via `wrangler pages deploy dist`. The Node version comes from `.node-version`.

Required repo secrets: `CLOUDFLARE_API_TOKEN` (Account > Cloudflare Pages > Edit) and `CLOUDFLARE_ACCOUNT_ID`. Turn off automatic deployments in Cloudflare (Settings > Builds & deployments) to avoid double builds.

## CMS login

Choose "Sign In with Token" and use a fine-grained PAT owned by `happier-solutions`, limited to the `tmdn` repo, with read/write access to Contents and Pull requests.
