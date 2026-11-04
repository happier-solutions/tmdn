## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Rules:

- Chat: reply in the conversation's language.
- Code, names, comments, git commit: English.
- **Design system**: read `DESIGN.md` before UI changes and update it when tokens or components change.
- **CSS**: keep it short. Split long files by concern when possible (`tokens.css`, `base.css`, `prose.css`) and `@import` them from `global.css`. Put component styles in the component's scoped `<style>` and only shared styles in `src/styles/`. No PostCSS needed: Vite resolves `@import`.
- **Git** use Conventional Commits: type(scope): subject, where type is feat, fix, docs, style, refactor, perf, test, build, ci or chore and the scope is optional. Keep it short: a subject line, plus a brief body only when the change needs explaining. 