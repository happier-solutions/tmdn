# Design system

Describes the current UI (baseline, see `docs/plan.md`). Sources: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/links.css`, `src/styles/transitions.css`, `src/styles/ruled.css`, fonts in `astro.config.mjs`. If this file and the code disagree, the code wins; fix this file.

## Principles

A reflective notebook: minimal, calm, comfortable for long reading.

- Warm paper background (light or dark), neutrals, one accent (bronze gold).
- Generous whitespace, moderate column width, body text at least 17-18px on desktop.
- Mobile first: most readers are on phones.
- No annoying popups, ads, or screen-filling banners.
- Hierarchy comes from type and thin rules. No cards or shadows.
- The home page is four separate blocks, each a grid of cells split by gold rules. Its pictures are the posts' hero images, and demo posts use old East Asian paintings of plants that echo the logo's sprig.
- No motion, except the page content fading in on navigation, link hovers, the `PostCard` image hover, the home figures counting up, and the `ShareLinks` toast.

## Colors

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#111110` | same | Footer and skip link background, selection text |
| `--on-ink` | `#f4efe6` | same | Text on `--ink` |
| `--gold-light` | `#c9a56b` | same | Footer links, selection background |
| `--gold-deep` | `#a57f45` | same | Logo only |
| `--paper` | `#f4efe6` | `#191713` | Page, header and drawer background |
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
| Home `h1` | `calc(100cqi / 6.95)`, one line across its cell. 6.95em is the name's set width at `-0.02em` tracking, so update it if `SITE_TITLE` changes |
| Home statement | `clamp(1.25rem, 1rem + 1vw, 1.75rem)`, heading font |
| Home section heading | `2rem` |
| Home category title | `1.25rem` |
| Home stat figure | `clamp(2.5rem, 2rem + 2vw, 3.5rem)`, body font: Playfair's old-style numerals don't hold up at this size |
| Home chart title | `1.25rem` |
| `h2` / `h3` / `h4` / `h5` | `1.75em` / `1.4em` / `1.2em` / `1.1em` |
| `PostCard` title | `1.5rem`, `1.25rem` in the home grid from `64rem` |
| `Signup` heading | `clamp(1.5rem, 1.25rem + 1.25vw, 2rem)` |
| Brand, related posts heading | `1.25rem` |
| Body | `1.125rem` |
| Blockquote | `1.125em` |
| Pagination, category descriptions, notes | `1rem` |
| Nav, menu buttons, meta, tags, footer, labels | `0.875rem` |

Line height: body 1.7, headings 1.25. Headings use `text-wrap: balance`; `.prose` paragraphs, list items, and blockquotes use `pretty`.

## Layout

- Content column (`main`, `.wrap`): max `44rem`, inline padding `1rem`.
- Wide column (`.wrap-wide`): max `72rem`, for header and footer, and for `main` on posts (`wide` prop of `BaseLayout`).
- Home blocks (`index.astro`, `wide`): four sections `3.5rem` apart, each a `1px` gold frame around cells that share one rule (`.ruled` and `.cell` in `ruled.css`). Cell padding `1.5rem 1rem`, `2rem` from `40rem`. The last two have a heading row above the frame, `1.25rem` from it, with a note at its far end where there is one.
  - Giới thiệu: the name across the frame, then statement and description (3:2 from `40rem`).
  - Bài viết mới nhất: the seven newest posts, all the same size, and an "all posts" cell, which make full rows at one column, two from `40rem`, and four from `64rem` (cell padding `1.5rem`). Fewer than seven posts leave empty cells.
  - Danh mục: five cells that wrap by themselves (`flex: 1 1 10rem` of content width), five in a row at full width, and the last row stretches.
  - Thống kê (`HomeStats`): four figures, then the timeline and two breakdowns. Figures in one column below `40rem`, two from `40rem`, four from `64rem`; the timeline spans the row from `40rem` and two columns from `64rem`, so rows stay full.
- Post grid (`PostLayout`): from `64rem`, three columns with a `2rem` gap, the middle one max `42rem` (the same reading width as the content column). Below that, one `42rem` column.
- `main` block padding: `3rem`, or `2rem` at `max-width: 720px`.
- `body` is a column flexbox with `min-height: 100dvh`, keeping the footer at the bottom.
- `.first-screen` wraps `main` and `Signup` with `min-height: calc(100svh - 3.3125rem)`, the header's height. On short pages `Signup` ends the first screen and `Footer` sits below it, so update it if the header's height changes.
- Nav breakpoint: drawer below `60rem`, row from `60rem`.
- Spacing has no tokens. Use these `rem` values: `0.25 0.5 0.75 1 1.25 1.5 2 2.5 3 3.5`.
- Common gaps: end-of-post blocks `3rem`, post list items `2.5rem`, post header and hero `2rem`.

## Shapes

- Rules: `1px solid var(--gold)`. Left bars: `3px solid var(--gold)`.
- Radius: images and `pre` `8px` (home `PostCard` images `0`, flush to their cell's rules), inline code `2px`, logo and buttons `0`, except the round `ShareLinks` buttons and their toast (`1.25rem`).
- Hero image: 2:1 (1020x510), full column width. On the home page it is cropped to 3:2.

## Components

Layouts: `BaseLayout` (shell), `PageLayout` (static), `ListLayout` (paginated), `PostLayout` (post).

| Component | Notes |
|---|---|
| `Header` | Logo and title left, nav right, gold bottom rule, `--paper` background. Pinned to the top (`position: sticky`, `z-index: 1`) from `34rem` viewport height and with popover support. `html` has `scroll-padding-top: 5rem` to match, so grow it if the bar grows. Below `60rem`: right drawer via Popover API, `--paper` background, width `min(20rem, 85vw)`; wrapped row without popover support |
| Menu buttons | Gold border, no fill, weight 600, square, min height `2.75rem` |
| Nav links | `--gray-dark`, weight 400, `1.5rem` apart in the row. Hover draws the rule and sprig (see States) but keeps the color. `aria-current`: `--accent` and the rule, sprig on hover only |
| `ThemeSwitch` | One icon button, no border or fill, `--gray-dark` icon, `--accent` on hover. The icon shows the current mode and each click moves to the next: system, the opposite of the OS, then the other pinned scheme. Icons: half-filled circle (system), sun, moon. Negative margins line the icon up with the links. Last in `.site-nav`: at the end of the row from `60rem` (`2.25rem`), under the links in the drawer (`2.75rem`). Hidden without JS |
| `Signup` | Band above `Footer`, same `--ink` background, `color-scheme: dark`. Text left and form right from `60rem`, stacked below. Visible label, `--on-ink` square input, `--gold-light` square button with `--ink` text and weight 600 (`--on-ink` on hover), both min height `3rem` and `1rem` text. Plain POST to `NEWSLETTER_ACTION` in `consts.ts`, field `email`. The error shows after interaction (`:user-invalid`) as text with a `3px` left bar and replaces the browser's bubble. Without an endpoint, production shows an RSS link instead and dev shows a form that sends nothing |
| `Footer` | `--ink` background, `--on-ink` text, `--gold-light` links, `--on-ink` on hover. Sets `color-scheme: dark`, so tokens and focus outlines resolve to their dark values. Link columns (`Chuyên mục`, `Chủ đề`, `Về blog`; auto-fit, min `9rem`), then logo and copyright, split by gold rules |
| `PostCard` | Title, `--gray` description, then meta at the card's foot, so dates line up across a grid row. No border or background. With `imageSizes` it shows the hero image above the text and the title's link covers the card; the category stays a separate link. Hovering the card scales the image to `1.04` inside its frame over 500ms, hover only and off under `prefers-reduced-motion` |
| Home link cell | A category (`CategoryIcon`, title, `--gray` description, post count) or the "all posts" cell (heading font link, post count). The whole cell is the link (`a::before`), with a `--gray-light` background on hover and an inset focus outline |
| `HomeStats` | Real numbers from published posts, at build time. Figures: posts, syllables written, topics used, changed-mind notes. Rendered at their final value, then count up from 0 over 900ms when `60%` visible; no script and reduced motion show the final value. Timeline: running total as a `2px` `--accent` line with a `10%` area wash, `--gray-light` hairline ticks, and `8px` dots with a `2px` `--paper` ring. Each post is a full-height `24px` link with a crosshair and a tooltip on hover and focus (`--black` background, `--paper` text, like the toast), and `details` holds the same data as a table. Breakdowns: `8px` `--accent` bars with a `4px` rounded end and the count at the tip, one hue for all rows. Topics are ranked and link to their page; confidence keeps its own order |
| `CategoryIcon` | One line icon per category: eye (`quan-sat`), question mark (`cau-hoi`), magnifying glass (`nghien-cuu`), open book (`bai-hoc`), pen (`nhat-ky-hoc-tap`). `32x32` grid shown at `36px`, `1.25` stroke, `--accent`, no fill, hidden from screen readers |
| `PostMeta` | Dates, category, reading time, confidence level |
| `UpdateNote` | `--gray-light` background, gold left bar |
| `ShareLinks` | Facebook link, Zalo button, copy-link button: round, `1px` gold border, `--gray-dark` stroke icon, `--accent` on hover, no brand colors or counts. A row at the end of the post below `64rem` (`2.75rem`), a pinned column left of the post from `64rem` (`2.25rem`). Zalo opens the share sheet on touch screens and copies the link elsewhere. The result shows for 4s in a toast centered `1.5rem` above the bottom edge: `--black` background, `--paper` text at `0.875rem` (inverted in both schemes), `--gold` check on success, no icon on failure, no shadow or close button, clicks pass through. It fades and rises `0.5rem` over 220ms (fade only under `prefers-reduced-motion`). A separate `.sr-only` `role="status"` announces the same text. No third-party scripts. Buttons are hidden without JS |
| `Toc` | Only on posts with 3 or more `h2`/`h3`. `0.875rem`, `--gray` links, `h3` indented. Current section: `--accent` and a `3px` gold left bar, tracked with `scroll-target-group`, or a scroll listener where unsupported. A closed `details` under the post header below `64rem`, a pinned column right of the post from `64rem` |
| `RelatedPosts` | Link list, gold top rule |
| `PrevNext` | Auto-fit two-column grid, newer post right-aligned |
| `Pagination` | Three-column grid: previous, `Trang x/y`, next |
| `.post-list` | No bullets |

## States and accessibility

- Links, nav included, have no underline at rest and rely on color. On hover (`links.css`) the color changes to `--accent-dark`, a 1px `currentColor` rule draws from the left (300ms), then the logo's sprig (`public/sprig.svg`, as a mask) grows from its end (260ms, 180ms delay). Hover only under `(hover: hover)`; no animation under `prefers-reduced-motion`. A link that is a block or flex item wraps its text in `.link-line`. In `PostMeta` the separator after the category fades out on hover and the sprig takes its place. In running text in `.prose` the sprig is off, since it would cover the text; these links keep the rule at rest, because color alone doesn't set them apart, and it thickens to 2px on hover. `Toc` links also have no sprig, and `ShareLinks` has neither rule nor sprig. The skip link opts out.
- Link focus: `outline: 2px solid var(--accent)`, offset `2px`.
- Skip link is hidden until focused and sits above the pinned header (`z-index: 2`). Use `.sr-only` for screen-reader-only text.
- Page transition: native `@view-transition` in `transitions.css`. Header and footer swap instantly; `main` fades in over 220ms and rises `0.5rem`. The header has its own transition name so `main` never paints over it. Off under `prefers-reduced-motion`; Firefox navigates instantly. `<link rel="expect">` in `BaseHead` waits for `#main`, so keep that id in the layout.
- `lang="vi"`; dates use `vi-VN` and `Asia/Ho_Chi_Minh`.

## Brand

- Logos: `public/logo.svg`, `public/favicon.svg`. `public/sprig.svg` is the logo's branch alone, used as the link hover mask.
- Colors are also hardcoded in those files and in `theme-color` in `BaseHead.astro` (one per scheme, matching the header, `--paper`); update them with the palette.
- Demo post paintings: `hero.jpg` in each post's folder, public domain or CC0, cropped to 3:2 (sources in `docs/image-credits.md`). `heroCredit` shows the title and artist as plain text under the hero image in the post, not on cards.
- UI copy is Vietnamese, first person, as a learner rather than an expert (for example "Tôi đã đổi quan điểm").

## Known gaps

- Category links in `PostMeta` and `PostCard`: `--accent` barely differs from the surrounding `--gray` meta text, so they are hard to spot without an underline.
- Footer focus outline: stays `#7a5a2b` without `light-dark()` (Safari below 17.5), 2.99:1 on `--ink`.
- Menu buttons have no custom focus style.
- `pre` stays dark in both schemes.
- `.prose` only sets `text-wrap`; `table` only sets `width: 100%`.
- `pre` uses Astro's default code theme, not the site palette.
- `--gold-deep` is unused in CSS.
- Requirements ask for a text-only name, but the header also shows a logo.
