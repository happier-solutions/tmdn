# Design system

Describes the current UI (baseline, see `docs/plan.md`). Sources: `src/styles/global.css`, fonts in `astro.config.mjs`. If this file and the code disagree, the code wins; fix this file.

## Principles

A reflective notebook: minimal, calm, comfortable for long reading.

- Light background, dark text, neutrals, one accent (bronze gold).
- Generous whitespace, moderate column width, body text at least 17-18px on desktop.
- Mobile first: most readers are on phones.
- No annoying popups, ads, or screen-filling banners.
- Hierarchy comes from type and thin rules. No cards, shadows, or motion.

## Colors

| Token | Value | Use |
|---|---|---|
| `--ink` | `#111110` | Footer and skip link background, selection text |
| `--paper` | `#f4efe6` | Page background, text on dark |
| `--gold` | `#b8935a` | Rules, borders, left bars |
| `--gold-light` | `#c9a56b` | Footer links, selection background |
| `--gold-deep` | `#a57f45` | Logo only |
| `--accent` | `#7a5a2b` | Links, active/hover nav, focus outline |
| `--accent-dark` | `#5c4320` | Link hover |
| `--black` | `17, 17, 16` | Headings, brand, drawer backdrop |
| `--gray-dark` | `42, 38, 33` | Body text, nav links |
| `--gray` | `107, 98, 86` | Secondary text |
| `--gray-light` | `229, 222, 209` | Inline code and `UpdateNote` background |

`--black` and `--gray*` are RGB triplets: use `rgb(var(--gray))` or `rgba(var(--black), 0.4)`.

**Text rule:** gold tones are decorative on `--paper` (2.02-3.20:1). On light backgrounds use `--accent` (5.51:1), `--accent-dark` (8.05:1), or `--gray` (5.23:1). On `--ink` use `--gold-light` (8.17:1) or `--paper`.

## Typography

| Role | Font | Weights | Variable |
|---|---|---|---|
| Body, UI | Montserrat, `sans-serif` | 400, 700 | `--font-body` |
| Headings, brand | Playfair Display, `serif` | 400 only | `--font-heading` |

Loaded with Astro Fonts (Fontsource), subsets `vietnamese`, `latin`, `latin-ext`. Only weight 400 of `latin` and `vietnamese` is preloaded.

| Role | Size |
|---|---|
| `h1` | `clamp(2rem, 1.5rem + 2.5vw, 2.75rem)` |
| `h2` / `h3` / `h4` / `h5` | `1.75em` / `1.4em` / `1.2em` / `1.1em` |
| `PostCard` title | `1.5rem` |
| Brand, related posts heading | `1.25rem` |
| Body | `1.125rem` |
| Blockquote | `1.125em` |
| Nav, pagination, category descriptions, notes | `1rem` |
| Meta, tags, footer, labels | `0.875rem` |

Line height: body 1.7, headings 1.25. Headings use `text-wrap: balance`; `.prose` paragraphs, list items, and blockquotes use `pretty`.

## Layout

- Content column (`main`, `.wrap`): max `44rem`, inline padding `1rem`.
- Wide column (`.wrap-wide`): max `72rem`, for header and footer.
- `main` block padding: `3rem`, or `2rem` at `max-width: 720px`.
- `body` is a column flexbox with `min-height: 100dvh`, keeping the footer at the bottom.
- Nav breakpoint: drawer below `60rem`, row from `60rem`.
- Spacing has no tokens. Use these `rem` values: `0.25 0.5 0.75 1 1.25 1.5 2 2.5 3 3.5`.
- Common gaps: home sections `3.5rem`, end-of-post blocks `3rem`, post list items `2.5rem`, post header and hero `2rem`.

## Shapes

- Rules: `1px solid var(--gold)`. Left bars: `3px solid var(--gold)`.
- Radius: images and `pre` `8px`, inline code `2px`, logo and buttons `0`.
- Hero image: 2:1 (1020x510), full column width.

## Components

Layouts: `BaseLayout` (shell), `PageLayout` (static), `ListLayout` (paginated), `PostLayout` (post).

| Component | Notes |
|---|---|
| `Header` | Logo and title left, nav right, gold bottom rule. Below `60rem`: right drawer via Popover API, width `min(20rem, 85vw)`; wrapped row without popover support |
| Menu buttons | Gold border, no fill, square, min height `2.75rem` |
| Nav links | `--gray-dark`, no underline; `--accent` and underline on hover or `aria-current` |
| `Footer` | `--ink` background, `--paper` text, `--gold-light` links, `--paper` on hover |
| `PostCard` | Meta, title, `--gray` description. No border or background |
| `PostMeta` | Dates, category, reading time, confidence level |
| `UpdateNote` | `--gray-light` background, gold left bar |
| `RelatedPosts` | Link list, gold top rule |
| `PrevNext` | Auto-fit two-column grid, newer post right-aligned |
| `Pagination` | Three-column grid: previous, `Trang x/y`, next |
| `.post-list` | No bullets |

## States and accessibility

- Links are underlined, except `PostCard` titles, brand, and nav links.
- Link focus: `outline: 2px solid var(--accent)`, offset `2px`.
- Skip link is hidden until focused. Use `.sr-only` for screen-reader-only text.
- `lang="vi"`; dates use `vi-VN` and `Asia/Ho_Chi_Minh`.

## Brand

- Logos: `public/logo.svg`, `public/favicon.svg`.
- Colors are also hardcoded in those files and in `theme-color` in `BaseHead.astro`; update them with the palette.
- UI copy is Vietnamese, first person, as a learner rather than an expert (for example "Tôi đã đổi quan điểm").

## Known gaps

- Footer focus outline: `--accent` on `--ink` is 2.99:1, below 3:1.
- Menu buttons have no custom focus style.
- `.prose` only sets `text-wrap`; `table` only sets `width: 100%`.
- `pre` uses Astro's default code theme, not the site palette.
- `--black` duplicates `--ink`; `--gold-deep` is unused in CSS.
- Requirements ask for a text-only name, but the header also shows a logo.
- No dark mode (P3).
