# Design system

Describes the current UI (baseline, see `docs/plan.md`). Sources: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/links.css`, `src/styles/transitions.css`, `src/styles/ruled.css`, `src/styles/prose.css`, fonts in `astro.config.mjs`. If this file and the code disagree, the code wins; fix this file.

## Principles

A reflective notebook: minimal, calm, comfortable for long reading.

- Warm paper background (light or dark), neutrals, one accent (bronze gold).
- Generous whitespace, moderate column width, body text at least 17-18px on desktop.
- Mobile first: most readers are on phones.
- No annoying popups, ads, or screen-filling banners.
- Hierarchy comes from type and thin rules. No cards or shadows.
- The home page is five separate blocks, each a grid of cells split by gold rules, except the categories' star from `64rem` and the latest posts below `40rem`, split by whitespace alone. Today's date above the first block has no frame. Its pictures are the posts' hero images, and demo posts use old East Asian paintings of plants that echo the logo's sprig.
- No motion, except the page content fading in on navigation, link hovers, the `PostCard`, `PostRow` and `PostTile` image hover, the home figures counting up, the `Branch` growing once, the `HomeCategories` star drawing once, the `ShareLinks` toast and thanks modal, the `TimeOnPage` hourglass, `ScrollTop` appearing and scrolling, `StarRating` hover, the `PostFeedback` message field appearing, and `VisitThanks` playing once a session.

## Colors

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#111110` | same | Footer, `Signup` and skip link background, selection text |
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
| `--gray-light` | `#e5ded1` | `#2e2a23` | Inline code, `UpdateNote`, home statement and description, list intro, `StageNav` and `Feedback` background |

Tokens are full colors, switched with `light-dark()`: use `var(--gray)`. The footer stays dark in both schemes, so use `--on-ink`, not `--paper`, for text on `--ink`.

**Text rule:** in light, gold tones are decorative on `--paper` (2.02-3.20:1). On `--paper` use `--accent` (5.51:1), `--accent-dark` (8.05:1), or `--gray` (5.23:1). In dark, those three reach 8.91:1, 12.49:1, and 6.77:1 on `--paper`. On `--ink` use `--gold-light` (8.17:1) or `--on-ink`.

**Color scheme:** system by default. `ThemeSwitch` pins light or dark by storing `color-scheme` in `localStorage` and setting `<meta name="color-scheme">`, which `tokens.css` maps to the `color-scheme` property. An inline script in `BaseHead` applies it before the first paint. Without `light-dark()` (Safari below 17.5) the site stays light.

## Typography

| Role | Font | Weights | Variable |
|---|---|---|---|
| Body, UI | Montserrat, `sans-serif` | 400, 600 (`Signup`, `Feedback`, `PostFeedback` and `ShareLinks` thanks buttons only), 700 | `--font-body` |
| Headings, brand | Playfair Display, `serif` | 400 only | `--font-heading` |

Loaded with Astro Fonts (Fontsource), subsets `vietnamese`, `latin`, `latin-ext`. Only weight 400 of `latin` and `vietnamese` is preloaded.

| Role | Size |
|---|---|
| `h1` | `clamp(1.75rem, 1.25rem + 2.5vw, 2.75rem)`, with `lining-nums` |
| List page `h1` | `2rem` |
| Home date | `min(100cqi / 12, 5rem)`, one line, lining numerals, `-0.02em` tracking, capped from about `60rem`. 12em fits the longest date |
| Home statement | `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)`, heading font |
| Home description, heading row note | `0.875rem` |
| Home section heading | `1.5rem` |
| Home category title | `1.25rem` |
| Home stat figure | `clamp(2.5rem, 2rem + 1.5vw, 3rem)`, heading font with `lining-nums`: Playfair's default old-style numerals don't hold up at this size |
| Home chart title | `1.25rem` |
| `VisitThanks` time | `clamp(2.5rem, 2rem + 2vw, 3.5rem)`, body font, with tabular numerals so it doesn't jitter |
| `VisitThanks` message, `ShareLinks` thanks title | `1.25rem`, heading font |
| `ShareLinks` thanks saying / wish / signature | `1.125rem` heading font in `--accent` / `1rem` / `0.875rem` in `--gray` |
| `h2` / `h3` / `h4` / `h5` | `1.75em` / `1.4em` / `1.2em` / `1.1em`. In `.prose` below `40rem`: `h2` `1.5em`, `h3` `1.25em`, so `h2` stays well under the `h1` |
| `PostCard` title | `1.5rem`. Home grid: `1.125rem`, `1.25rem` from `40rem`, `1.125rem` from `64rem` |
| `PostCard` description | `0.875rem`, `1rem` from `40rem`, `0.875rem` from `64rem`, line height 1.5. With an image, below `40rem`: clamped to 4 lines |
| `PostRow` title | `1.25rem`, `1.125rem` from `64rem`. Featured: `1.5rem`, `1.75rem` from `64rem` |
| `PostRow` description | `0.875rem` below `40rem`, `1rem` from `40rem`, `0.875rem` from `64rem` (featured stays `1rem`), line height 1.5 |
| `PostTile` title | `1.125rem` |
| `Signup` heading | `clamp(1.5rem, 1.25rem + 1.25vw, 2rem)` |
| `Feedback` question | `1.25rem`, heading font |
| `PostFeedback` question | `1rem` |
| Brand, related posts heading, `AuthorBio` name | `1.25rem` |
| Body | `1.0625rem` below `40rem`, `1.125rem` from `40rem` |
| Blockquote | `1em` below `40rem`, `1.125em` from `40rem` |
| Pagination, category descriptions, notes | `1rem` |
| Nav, meta, tags, footer, labels | `0.875rem` (home post meta and count `0.75rem` below `40rem` and from `64rem`, `PostRow` meta `0.75rem` below `40rem` and from `64rem`, `ShareLinks` heart count `0.75rem`) |

Line height: body 1.65 below `40rem`, 1.7 from `40rem`; `h1` 1.3, to keep Vietnamese marks clear of the line above; other headings 1.25; `PostMeta` 1.5. Headings use `text-wrap: balance`; `.prose` paragraphs, list items, and blockquotes use `pretty`.

## Layout

- Content column (`main`, `.wrap`): max `44rem`, inline padding `1rem`.
- Wide column (`.wrap-wide`): max `72rem`, for header and footer, and for `main` on posts (`wide` prop of `BaseLayout`).
- Home blocks (`index.astro`, `wide`): five sections `2.5rem` apart, `3rem` from `40rem`, each a `1px` gold frame around cells that share one rule (`.ruled` and `.cell` in `ruled.css`). Cell padding `1.5rem 1rem`, `2rem` from `40rem`. Today's date (`Thứ Tư, 4 tháng 11, 2026`) sits unframed above the first frame, `1rem` from it, set by an inline script from the visitor's clock before first paint and absent without JS. The page's `h1` is `SITE_TITLE` in `.sr-only`. The last three have a heading row above the frame, `1rem` from it, with a note at its far end where there is one.
  - Giới thiệu: the name across the frame, then statement and description on `--gray-light` (3:2 from `40rem`, cell padding `1.5rem` from `64rem`). `--accent` on it is 4.72:1 in light, 7.10:1 in dark.
  - Bài viết mới nhất: the seven newest posts, all the same size, and an "all posts" cell, which make full rows at one column, two from `40rem` (cell padding `1.5rem`), and four from `64rem` (cell padding `1.25rem`). Below `40rem` it has no frame, rules or cell padding, with `1.5rem` between posts. Fewer than seven posts leave empty cells.
  - Danh mục (`HomeCategories`): one dark `--paper` frame (`#191713`), the page's focal point. On a dark page only its gold rules set it apart, since it matches the page there.
  - Thống kê (`HomeStats`): four figures, then the timeline and two breakdowns. Figures in one column below `40rem`, two from `40rem`, four from `64rem`; the timeline spans the row from `40rem` and two columns from `64rem`, so rows stay full.
  - Đánh giá và góp ý (`Feedback`, inside `VisitThanks`): the rating and the message (2:3 from `40rem`, stacked below), then a full-width row with the submit button.
- List pages (`ListLayout`, `wide`): denser than the rest of the site, with `main` block padding `2rem` at any width, except no top padding below `40rem`. Below `40rem` the frames run edge to edge with no side rules, so the list starts right under the header and text keeps its `1rem` inset. One frame of an intro row and a grid of posts, one column, two from `40rem`, three from `64rem`. The newest post on page one spans the row, so with `PAGE_SIZE` 13 a full page one has full rows at any column count. Cell block padding `1.25rem` (facts `0.75rem` below `40rem`), inline padding `1.5rem` from `40rem`, `1.25rem` from `64rem`. Cells close their own right and bottom rules and the frame encloses any empty cells of a short last row. Intro: on `--gray-light`, where text uses `--gray-dark`, since `--gray` is only 4.48:1 on it in light. Title cell, with the icon beside the text at any width, then a facts cell with the post count and the date of the list's newest post, on every page: one line below `40rem`, each label beside its value and the two at either end, stacked in `14rem` from `40rem`, a row in the last of the three columns from `64rem`. Then `Pagination`, and `StageNav` on category pages, `2rem` below.
- Post grid (`PostLayout`): from `64rem`, three columns with a `2rem` gap, the middle one max `42rem` (the same reading width as the content column). Below that, one `42rem` column.
- `main` block padding: `3rem`, or `2rem` at `max-width: 720px`.
- `body` is a column flexbox with `min-height: 100dvh`, keeping the footer at the bottom.
- `.first-screen` wraps `main` and `Signup` with `min-height: calc(100svh - 3.3125rem)`, the header's height. On short pages `Signup` ends the first screen and `Footer` sits below it, so update it if the header's height changes.
- Nav breakpoint: drawer below `60rem`, row from `60rem`.
- Spacing has no tokens. Use these `rem` values: `0.25 0.5 0.75 1 1.25 1.5 2 2.5 3 3.5`.
- Common gaps: end-of-post blocks `3rem`, post header and hero `2rem` (`1.5rem` below `40rem`), tags and `ShareLinks` row `1.5rem` above.
- `.prose` (`prose.css`): lists `1.5rem` indent, `0.5rem` between items; `h2` `2.5rem` above and `0.75rem` below, `h3` `2rem` and `0.5rem`; blockquote `1.5rem` above and below, `1rem` indent below `40rem`; `pre` padding `1rem` below `40rem`.

## Shapes

- Rules: `1px solid var(--gold)`. Left bars: `3px solid var(--gold)`.
- Radius: images and `pre` `8px` (home `PostCard` and `PostRow` images `0`, flush to their cell's rules, except the home `PostCard` and non-featured `PostRow` below `40rem`, which sit beside their text), inline code `2px`, logo and buttons `0`, except the round `ShareLinks`, `TimeOnPage` and `ScrollTop` buttons and the toast, heart count and `TimeOnPage` bubble (`1.25rem`).
- Hero image: 2:1 (1020x510), full column width. On a post below `40rem` it runs edge to edge, flush to the header, with no radius. On the home page and in `PostRow` it is cropped to 3:2. From `64rem` the `PostRow` crop is 16:9, and 2:1 when featured. Below `40rem` the featured `PostRow` crop is 16:9. Below `40rem` the `PostCard` frame stretches with its description (3:2 at least). In a one-column list the `PostRow` image is a fixed `5rem` square.

## Components

Layouts: `BaseLayout` (shell), `PageLayout` (static), `ListLayout` (paginated), `PostLayout` (post).

| Component | Notes |
|---|---|
| `Header` | Logo and title left, nav right, `--paper` background, gold bottom rule from `60rem` (transparent below, keeping the height). Pinned to the top (`position: sticky`, `z-index: 1`) from `34rem` viewport height and with popover support. `html` has `scroll-padding-top: 5rem` to match, so grow it if the bar grows. Below `60rem`: right drawer via Popover API, `--paper` background, width `min(20rem, 85vw)`; wrapped row without popover support |
| Menu buttons | Icon only, named with `aria-label`: three lines to open, a cross to close, in the same spot. `24px` icon, `1.5px` round stroke, in a `2.75rem` square, no border or fill. `--black`, `--accent` on hover, `Link focus` outline. Negative margin lines the icon up with the page edge |
| Nav links | `--gray-dark`, weight 400, `1.5rem` apart in the row. Hover draws the rule and sprig (see States) but keeps the color. `aria-current`: `--accent` only, with the rule and sprig on hover like the other links. Underlined in forced colors, where the color is lost |
| `ThemeSwitch` | One icon button, no border or fill, `--gray-dark` icon, `--accent` on hover. The icon shows the current mode and each click moves to the next: system, the opposite of the OS, then the other pinned scheme. Icons: half-filled circle (system), sun, moon. Negative margins line the icon up with the links. Last in `.site-nav`: at the end of the row from `60rem` (`2.25rem`), under the links in the drawer (`2.75rem`). Hidden without JS |
| `Signup` | Band above `Footer`, same `--ink` background, `color-scheme: dark`. Text left and form right from `60rem`, top-aligned so the eyebrow and label share a line and the heading starts level with the input, stacked below. Visible label, `--on-ink` square input with a placeholder (`--ink` mixed 65% into `--on-ink`, 5.59:1), `--gold-light` square button with `--ink` text and weight 600 (`--on-ink` on hover), both min height `3rem` and `1rem` text. Submitting opens the reader's mail app with a prefilled `mailto:` to `CONTACT_EMAIL` in `consts.ts`, then shows that address as a text with a `3px` left bar in case no app opens. The error shows after interaction (`:user-invalid`) as text with a `3px` left bar and replaces the browser's bubble. Without JS (`@media (scripting: none)`) the form is hidden and a `<noscript>` line links the address, since the `mailto:` lives in `data-mailto`: Chrome reports one in `action` as mixed content. |
| `StarRating` | Five native radios hidden with `.sr-only`, shown as `32px` line stars in `3rem` tap targets (`small`: `20px` stars, `2.25rem` wide and `3rem` tall) with a `1.5` `--accent` stroke; stars up to the chosen or hovered one fill with `--accent` over 150ms, and the hovered one scales to `1.1`, no motion under `prefers-reduced-motion`. Negative margins line the outer stars up with the surrounding text |
| `PostFeedback` | After the post, before `AuthorBio`. No frame or rules: the question, then `small` `StarRating` `1rem` after it, wrapping below it on narrow screens. Choosing a star reveals an optional textarea (up to 300 characters, as the subject and body also carry the post's title and URL), a `--gray` note and the button, with the `Feedback` field and button styles at `0.875rem`. They fade and rise `0.25rem` over 240ms, also growing the block's height where `interpolate-size` is supported, no motion under `prefers-reduced-motion`. The field's label asks what was missing for 1-3 stars and what helped most for 4-5. The button can't appear without a rating, so there is no error state. Submitting opens the `mailto:` as in `Feedback`, then shows the address with a `3px` left bar. Same no-JS fallback as `Signup`. Absent in print |
| `Feedback` | A `.ruled` form on `--gray-light`, last on the home page, with `--gray-dark` notes since `--gray` is 4.48:1 on it in light. Rating: `StarRating`. Message: optional textarea, up to 500 characters so the `mailto:` URL stays under the roughly 2000 that some systems accept. `--paper` background, `1px` `--gray` border, since `--gold` is too faint for a field's edge, square, growing with its text up to `16lh`. Button: square, `--accent` background, `--paper` text, weight 600, min height `3rem`, `--accent-dark` on hover. Submitting opens the reader's mail app with a prefilled `mailto:` to `CONTACT_EMAIL`, then shows that address with a `3px` left bar, as in `Signup`. Submitting without a rating shows the error, also with a left bar, and focuses the first star. Same no-JS fallback as `Signup` |
| `VisitThanks` | Wraps a section, here the feedback heading and form, which stays transparent while a thanks plays in its space, so nothing below moves. When the thanks is on screen: `--gray` "Bạn đã ở đây", the time with the tab in front counting up over 900ms and then ticking, a `1px` `--gold` rule drawing with the sprig growing from its end, the message at 1.1s. At 4s it fades and the section fades in and rises `0.5rem`. Stays in view while scrolling (`position: sticky`). Plays once a session (`sessionStorage`). Focus inside the section ends it at once, and screen readers skip it and reach the section directly. No script and print show the section alone. Under `prefers-reduced-motion`: final time, fades only |
| `Branch` | Top of `Signup`, hidden from screen readers. A `1px` `--gold` rule fades in from the column's left edge and runs into a `256x64` stem with the logo's two-tone leaves, keeping its size on any width. When on screen it grows once, about 2.5s: rule, stem, then leaves in turn. No script and print show it grown; no motion under `prefers-reduced-motion` |
| `Footer` | `--ink` background, `--on-ink` text, `--gold-light` links, `--on-ink` on hover. Sets `color-scheme: dark`, so tokens and focus outlines resolve to their dark values. No rules: three bands split by tone, `Signup` on `--ink`, then the links on `--on-ink` mixed 6% into `--ink` (`--gold-light` 7.19:1), then the legal row back on `--ink`. Link columns: `Chuyên mục`, `Chủ đề`, `Về blog`; auto-fit, min `8rem`. Legal row, in `--on-ink` at 75%: logo, copyright and description, then a designer credit linking to `happier.io.vn` in a new tab, at the far end from `60rem` and under the copyright below |
| `PostCard` | Title, `--gray` description, then meta at the card's foot, so dates line up across a grid row. No border or background. With `imageSizes` it shows the hero image above the text and the title's link covers the card; below `40rem` the title comes first, then the image and description side by side (`2fr 3fr`, `0.5rem` row and `0.75rem` column gap), then the meta; the category stays a separate link. Hovering the card scales the image to `1.04` inside its frame over 500ms, hover only and off under `prefers-reduced-motion` |
| Home link cell | `.linked` in `ruled.css`: the "all posts" cell (heading font link, post count) and, below `64rem`, a category. The whole cell is the link (`a::before`), with a `--gray-light` background on hover and an inset focus outline |
| `HomeCategories` | Five stages on a pentagram, `1px` `--gold` lines, placed so one line runs through them in order: 1 top, 2 bottom right, 3 left, 4 right, 5 bottom left, with `color-scheme: dark` in both schemes so tokens resolve to their dark values, as in `Footer`. Each category has `CategoryIcon`, title, `--gray` description, and "Chặng n · x bài", since the order doesn't read around the star. From `64rem`, in a `41rem` frame with a `12rem` star radius: the icon sits in a `--paper` disc with a `1px` `--gold` border on its tip and the text runs outward, centered above the top tip and beside the others, up to `18rem` wide. Hover fills the disc with `--gray-light` instead of the cell, so the lines stay whole, and the focus outline sits `0.5rem` outside. The frame's height is fixed, so check it if a description grows past about four lines. Below `64rem`: a small star in its own cell, tips numbered `1` to `5`, then the cells wrapping by themselves (`flex: 1 1 10rem`), with the last row stretching. Each cell is a home link cell. When `50%` of the star is on screen it draws once, 3s, as one line from stage 1 through 5 and back to 1: every 600ms the stage's icon (the numbered tip below `64rem`) fades and scales in, then the line leaves for the next stage. The text stays visible throughout. No script and print show it drawn; no motion under `prefers-reduced-motion` |
| `HomeStats` | Real numbers from published posts, at build time. Figures: posts (page icon), syllables written (feather), topics used (tag), changed-mind notes (two opposing arrows). Each icon sits above its figure, `32px` on the `CategoryIcon` grid with the same stroke, `--accent`, lined up with the text, hidden from screen readers. Rendered at their final value, then count up from 0 over 900ms when `60%` visible; no script and reduced motion show the final value. Timeline: running total as a `2px` `--accent` line with a `10%` area wash, `--gray-light` hairline ticks, and `8px` dots with a `2px` `--paper` ring. Each post is a full-height `24px` link with a crosshair and a tooltip on hover and focus (`--black` background, `--paper` text, like the toast), and `details` holds the same data as a table. Breakdowns: `8px` `--accent` bars with a `4px` rounded end and the count at the tip, one hue for all rows. Topics are ranked and link to their page; confidence keeps its own order |
| `CategoryIcon` | One line icon per category: eye (`quan-sat`), question mark (`cau-hoi`), magnifying glass (`nghien-cuu`), open book (`bai-hoc`), pen (`nhat-ky-hoc-tap`). `32x32` grid shown at `36px` (`size` prop, `48px` in the list intro), `1.4px` non-scaling stroke at any size, `--accent`, no fill, hidden from screen readers |
| `PostRow` | A post in a list page's grid. Below `40rem` title and description sit left of a `5rem` square image, aligned to the top, with the meta under both at full width, so it stays on one line on most posts. `1rem` column gap. From `40rem` the image sits above the text, with the meta at the foot, so it lines up across a row. `featured` is the newest post on page one: "Mới nhất" label, image above, then beside the text from `40rem`, `1fr 1fr` and `2fr 1fr` from `64rem`, lining up with the columns below, loaded first. Without a hero image the frame is `--gray-light` with the `CategoryIcon`. Meta: date, reading time, confidence level, then the category link, which category pages leave out. The title's link covers the row, with a `--gray-light` background on hover, an inset focus outline and the `PostCard` image hover |
| `StageNav` | End of a category page: two cells to the previous and next category, in `CATEGORIES` order, each with `CategoryIcon`, a `--gray-dark` label and a heading font title, on `--gray-light`, with `1.25rem` block padding and the list's inline padding, edge to edge below `40rem` like the list. The whole cell is the link, with a `--paper` background on hover. At either end of the journey a `--gray-dark` note takes the empty cell from `40rem`; below that it is dropped |
| `PostMeta` | Dates, category, reading time, confidence level. The category link's tap area reaches `0.75rem` above and below, with no effect on layout |
| `UpdateNote` | `--gray-light` background, gold left bar |
| `ShareLinks` | Facebook link, copy-link button, thanks button (heart icon): round, `1px` gold border, `--gray-dark` stroke icon, `--accent` on hover, no brand colors or counts. A row at the end of the post below `64rem` (`2.75rem`), a pinned column left of the post from `64rem` (`2.25rem`). The copy result shows for 4s in a toast centered `1.5rem` above the bottom edge: `--black` background, `--paper` text at `0.875rem` (inverted in both schemes), `--gold` check on success, no icon on failure, no shadow or close button, clicks pass through. It fades and rises `0.5rem` over 220ms (fade only under `prefers-reduced-motion`). A separate `.sr-only` `role="status"` announces the same text. Each click on the thanks button adds a heart, stored per post in `localStorage` (`hearts:<path>`) in this browser only. A hearted post fills the icon with `--gold` and shows the count in a `1rem` `--accent` badge with `--paper` text at `0.75rem`, on the button's top right corner, up to `99+`. The button opens a modal `dialog`, centered, `min(24rem, 100vw - 2rem)` wide, `--paper` background, `1px` gold border, square, no shadow: a `32px` `--gold` heart with an `--accent` stroke, the `h2` "Cảm ơn bạn đã thả tim", with "lần thứ n" from the second heart, a random folk saying between `1px` gold rules, a wish that picks up on it, `SITE_TITLE` as the signature, and a `Đóng` button styled like the `Feedback` one. The 20 sayings and wishes live in `src/lib/thanks-messages.ts`, and the same one never shows twice in a row. `--ink` at 60% behind it. It closes with the button, Esc or a click outside. It fades and rises `0.5rem` over 220ms, with an instant exit in Firefox and Safari (fade only under `prefers-reduced-motion`). Nothing is sent to a server. No third-party scripts. Buttons are hidden without JS |
| `TimeOnPage` | Under `ShareLinks`: at the far end of their row below `64rem`, under the pinned column from `64rem`, `1rem` below the buttons. A round button like theirs (`2.75rem`, `2.25rem` from `64rem`, `1px` gold border, `--accent` on hover) holding a `26px` hourglass: two triangles with a `1.5px` `currentColor` outline and `--gold` sand that nearly fills a bulb, with dashed grains falling through the neck. The sand drains smoothly over 15s, counting only while the tab is in front, then the glass turns over in 900ms and starts again. Hovering with a mouse or clicking opens a chat bubble (`popover`): "Bạn đã ở đây 3 phút 12 giây", updating every second, with the toast's colors, type, radius and 220ms rise (fade only under `prefers-reduced-motion`), and a tail pointing at the button, above it and right-aligned below `64rem`, to its right from `64rem`. Hovering closes it 200ms after the pointer leaves both the button and the bubble, and a click pins it. Clicking outside or Esc closes it. It isn't a live region, so it never interrupts. Without anchor positioning it sits where the toast does, with no tail. Static, half-drained hourglass under `prefers-reduced-motion`. Absent without JS and in print |
| `ScrollTop` | On every page, once scrolled past `12.5rem`, so a page with less to scroll never shows it. Round, fixed `1rem` from the right and `1.5rem` from the bottom, `1px` gold border, `--paper` background so it stays clear over text and the `--ink` bands, `--gray-dark` stroke arrow, `--accent` on hover. `2.75rem`, `2.25rem` from `64rem`. It fades and rises `0.5rem` over 220ms (fade only under `prefers-reduced-motion`, which also makes the scroll instant). Clicking it moves focus to the brand link, for keyboard readers. Absent without JS and in print |
| `Toc` | Only on posts with 3 or more `h2`/`h3`. `0.875rem`, `--gray` links, `h3` indented. Current section: `--accent` and a `3px` gold left bar, tracked with `scroll-target-group`, or a scroll listener where unsupported. A closed `details` under the post header below `64rem`, a pinned column right of the post from `64rem` |
| `PostTile` | A compact post row with no frame or background, at any width: a `6rem` hero image with an `8px` radius (`1:1` at least, stretching with a taller text column), a `1rem` gap, then label, title and date, `0.5rem` under the title. `alignDate` pins the date to the foot instead, so dates line up across a row. Without a hero image the frame is `--gray-light` with the `CategoryIcon`. The title's link covers the tile, with the link's hover, the `PostCard` image hover and a `2px` `--accent` focus outline around the tile |
| `AuthorBio` | After the post, before `RelatedPosts`. No frame or rules: `64px` logo, then a `--gray` "Tác giả" label, `SITE_TITLE` as the `h2`, `AUTHOR_BIO` from `consts.ts` at `1rem`, and a `rel="author"` link to `/gioi-thieu/`. The bio and link sit under the logo below `40rem`, beside it from `40rem`. Same on every post, since the blog has one author |
| `RelatedPosts` | `h2`, then one `PostTile` per row, no frame, with a `1px` gold rule between rows, `1.25rem` from each. Leaves out the posts already in `PrevNext` |
| `PrevNext` | Two `alignDate` `PostTile`s ("← Bài trước", "Bài sau →") `1.5rem` below a `1px` gold rule, no frame. Stacked `1.5rem` apart below `40rem`, side by side `3rem` apart from `40rem`. The heading is `.sr-only`. At either end of the list a `--gray` note takes the empty cell from `40rem`; below that it is dropped |
| `Pagination` | Three-column grid: previous, `Trang x/y`, next. Links are at least `2.75rem` tall |

## States and accessibility

- Tap targets: post tags and buttons at least `2.75rem` tall, inline `Toc` links `0.5rem` block padding.
- Links, nav included, have no underline at rest and rely on color. On hover (`links.css`) the color changes to `--accent-dark`, a 1px `currentColor` rule draws from the left (300ms), then the logo's sprig (`public/sprig.svg`, as a mask) grows from its end (260ms, 180ms delay). Hover only under `(hover: hover)`; no animation under `prefers-reduced-motion`. A link that is a block or flex item wraps its text in `.link-line`. In `PostMeta` the separator after the category fades out on hover and the sprig takes its place. In running text in `.prose` the sprig is off, since it would cover the text; these links keep the rule at rest, because color alone doesn't set them apart, and it thickens to 2px on hover. `Toc` links also have no sprig, and `ShareLinks` has neither rule nor sprig. The skip link opts out.
- Link focus: `outline: 2px solid var(--accent)`, offset `2px`.
- Skip link is hidden until focused and sits above the pinned header (`z-index: 2`). Use `.sr-only` for screen-reader-only text.
- Page transition: native `@view-transition` in `transitions.css`. Header and footer swap instantly; `main` fades in over 220ms and rises `0.5rem`. The header has its own transition name so `main` never paints over it. Off under `prefers-reduced-motion`; Firefox navigates instantly. `<link rel="expect">` in `BaseHead` waits for `#main`, so keep that id in the layout.
- `lang="vi"`; dates use `vi-VN` and `Asia/Ho_Chi_Minh`.

## Brand

- Logos: `public/logo.svg`, `public/favicon.svg`. `public/sprig.svg` is the logo's branch alone, used as the link hover mask. `Branch` repeats the leaf paths, so update them with the logo.
- Colors are also hardcoded in those files and in `theme-color` in `BaseHead.astro` (one per scheme, matching the header, `--paper`); update them with the palette.
- Demo post paintings: `hero.jpg` in each post's folder, public domain or CC0, cropped to 3:2 (sources in `docs/image-credits.md`). `heroCredit` shows the title and artist as plain text under the hero image in the post, not on cards.
- UI copy is Vietnamese, first person, as a learner rather than an expert (for example "Tôi đã đổi quan điểm").

## Known gaps

- Category links in `PostMeta`, `PostCard` and `PostRow`: `--accent` barely differs from the surrounding `--gray` meta text, so they are hard to spot without an underline.
- Footer focus outline: stays `#7a5a2b` without `light-dark()` (Safari below 17.5), 2.99:1 on `--ink`.
- `pre` stays dark in both schemes.
- `table` only sets `width: 100%`, so a wide table would be clipped on a phone by `main`'s `overflow-x: clip`.
- `pre` uses Astro's default code theme, not the site palette.
- `--gold-deep` is unused in CSS.
- Requirements ask for a text-only name, but the header also shows a logo.
