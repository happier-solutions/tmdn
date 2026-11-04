# Design system

Describes the current UI (baseline, see `docs/plan.md`). Sources: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/links.css`, `src/styles/transitions.css`, fonts in `astro.config.mjs`. If this file and the code disagree, the code wins; fix this file.

## Principles

A reflective notebook: minimal, calm, comfortable for long reading.

- Warm paper background (light or dark), neutrals, one accent (bronze gold).
- Generous whitespace, moderate column width, body text at least 17-18px on desktop.
- Mobile first: most readers are on phones.
- No annoying popups, ads, or screen-filling banners.
- Hierarchy comes from type and thin rules. No cards or shadows.
- No motion, except the page content fading in on navigation and link hovers.

## Colors

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#111110` | same | Footer and skip link background, selection text |
| `--on-ink` | `#f4efe6` | same | Text on `--ink` |
| `--gold-light` | `#c9a56b` | same | Footer links, selection background |
| `--gold-deep` | `#a57f45` | same | Logo only |
| `--paper` | `#f4efe6` | `#191713` | Page background |
| `--ivory` | `#fbf8f2` | `#23201a` | Header and drawer background |
| `--gold` | `#b8935a` | `#9a7b4c` | Rules, borders, left bars |
| `--accent` | `#7a5a2b` | `#d4b27a` | Links, current nav link, focus outline |
| `--accent-dark` | `#5c4320` | `#ecd5a8` | Link hover |
| `--black` | `#111110` | `#f4efe6` | Headings, brand |
| `--gray-dark` | `#2a2621` | `#e3dccf` | Body text, nav links |
| `--gray` | `#6b6256` | `#a89e8e` | Secondary text |
| `--gray-light` | `#e5ded1` | `#2e2a23` | Inline code and `UpdateNote` background |

Tokens are full colors, switched with `light-dark()`: use `var(--gray)`. The footer stays dark in both schemes, so use `--on-ink`, not `--paper`, for text on `--ink`.

**Text rule:** in light, gold tones are decorative on `--paper` (2.02-3.20:1). On `--paper` use `--accent` (5.51:1), `--accent-dark` (8.05:1), or `--gray` (5.23:1). In dark, those three reach 8.91:1, 12.49:1, and 6.77:1 on `--paper`. On `--ink` use `--gold-light` (8.17:1) or `--on-ink`.

**Color scheme:** system by default. `ThemeSwitch` pins light or dark by storing `color-scheme` in `localStorage` and setting `<meta name="color-scheme">`, which `tokens.css` maps to the `color-scheme` property. An inline script in `BaseHead` applies it before the first paint. Without `light-dark()` (Safari below 17.5) the site stays light.

## Typography

| Role | Font | Weights | Variable |
|---|---|---|---|
| Body, UI | Montserrat, `sans-serif` | 400, 600 (menu buttons only), 700 | `--font-body` |
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
| Pagination, category descriptions, notes | `1rem` |
| Nav, menu buttons, meta, tags, footer, labels | `0.875rem` |

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
| `Header` | Logo and title left, nav right, gold bottom rule, `--ivory` background. Pinned to the top (`position: sticky`, `z-index: 1`) from `34rem` viewport height and with popover support. `html` has `scroll-padding-top: 5rem` to match, so grow it if the bar grows. Below `60rem`: right drawer via Popover API, `--ivory` background, width `min(20rem, 85vw)`; wrapped row without popover support |
| Menu buttons | Gold border, no fill, weight 600, square, min height `2.75rem` |
| Nav links | `--gray-dark`, weight 400, `1.75rem` apart in the row. Hover draws the rule and sprig (see States) but keeps the color. `aria-current`: `--accent` and the rule, sprig on hover only |
| `ThemeSwitch` | One icon button, no border or fill, `--gray-dark` icon, `--accent` on hover. The icon shows the current mode and each click moves to the next: system, the opposite of the OS, then the other pinned scheme. Icons: half-filled circle (system), sun, moon. Negative margins line the icon up with the links. Last in `.site-nav`: at the end of the row from `60rem` (`2.25rem`), under the links in the drawer (`2.75rem`). Hidden without JS |
| `Footer` | `--ink` background, `--on-ink` text, `--gold-light` links, `--on-ink` on hover |
| `PostCard` | Meta, title, `--gray` description. No border or background |
| `PostMeta` | Dates, category, reading time, confidence level |
| `UpdateNote` | `--gray-light` background, gold left bar |
| `RelatedPosts` | Link list, gold top rule |
| `PrevNext` | Auto-fit two-column grid, newer post right-aligned |
| `Pagination` | Three-column grid: previous, `Trang x/y`, next |
| `.post-list` | No bullets |

## States and accessibility

- Links, nav included, have no underline at rest and rely on color. On hover (`links.css`) the color changes to `--accent-dark`, a 1px `currentColor` rule draws from the left (300ms), then the logo's sprig (`public/sprig.svg`, as a mask) grows from its end (260ms, 180ms delay). Hover only under `(hover: hover)`; no animation under `prefers-reduced-motion`. A link that is a block or flex item wraps its text in `.link-line`. In `PostMeta` the separator after the category fades out on hover and the sprig takes its place. In running text in `.prose` the sprig is off, since it would cover the text; these links keep the rule at rest, because color alone doesn't set them apart, and it thickens to 2px on hover. The skip link opts out.
- Link focus: `outline: 2px solid var(--accent)`, offset `2px`.
- Skip link is hidden until focused and sits above the pinned header (`z-index: 2`). Use `.sr-only` for screen-reader-only text.
- Page transition: native `@view-transition` in `transitions.css`. Header and footer swap instantly; `main` fades in over 220ms and rises `0.5rem`. The header has its own transition name so `main` never paints over it. Off under `prefers-reduced-motion`; Firefox navigates instantly. `<link rel="expect">` in `BaseHead` waits for `#main`, so keep that id in the layout.
- `lang="vi"`; dates use `vi-VN` and `Asia/Ho_Chi_Minh`.

## Brand

- Logos: `public/logo.svg`, `public/favicon.svg`. `public/sprig.svg` is the logo's branch alone, used as the link hover mask.
- Colors are also hardcoded in those files and in `theme-color` in `BaseHead.astro` (one per scheme, matching the header, `--ivory`); update them with the palette.
- UI copy is Vietnamese, first person, as a learner rather than an expert (for example "Tôi đã đổi quan điểm").

## Known gaps

- Category links in `PostMeta` and `PostCard`: `--accent` barely differs from the surrounding `--gray` meta text, so they are hard to spot without an underline.
- Footer focus outline: `--accent` on `--ink` is 2.99:1, below 3:1.
- Menu buttons have no custom focus style.
- `pre` stays dark in both schemes.
- `.prose` only sets `text-wrap`; `table` only sets `width: 100%`.
- `pre` uses Astro's default code theme, not the site palette.
- `--gold-deep` is unused in CSS.
- Requirements ask for a text-only name, but the header also shows a logo.
