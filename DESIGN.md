# Design system

Describes the current UI. Sources: `src/styles/tokens.css`, `src/styles/global.css`, `src/styles/links.css`, `src/styles/transitions.css`, `src/styles/ruled.css`, `src/styles/prose.css`, fonts in `astro.config.mjs`. The direction comes from the "Trúc Chí Lập Thân" redesign brief (see `docs/plan.md`). If this file and the code disagree, the code wins; fix this file.

## Principles

A personal intellectual journal: an Eastern scholar's study in the shape of a modern digital magazine (about 45% literary magazine, 35% Eastern scholar, 20% research journal).

- Warm paper background (light or dark), neutrals, bamboo green for links and labels, seal red for a few small marks only.
- Type, whitespace and hairline rules carry the hierarchy. No cards, shadows, gradients or rounded corners, except the round utility buttons.
- One reading column of `45rem` (720px) for posts. Home and pillar pages use deliberate asymmetric grids (`7fr 5fr`, `1fr 3fr`) and vary their entries: `PostLead`, `PostRow`, `PostCard` and `PostTile` are four different shapes.
- Pictures are old East Asian paintings and prints, public domain or CC0, cropped on purpose: bamboo for Tàng Thư Quán Thế, a merchant street for Binh Pháp Công Sở.
- Mobile first: most readers are on phones.
- No annoying popups, ads, or screen-filling banners. No reading statistics or star forms on the home page.
- No motion, except the page content fading in on navigation, link hovers, card image hovers, the `ReadingProgress` bar, the `Branch` growing once, the `ShareLinks` toast and thanks letter, the `TimeOnPage` hourglass, `ScrollTop` appearing and scrolling, `StarRating` hover, the `PostFeedback` message field appearing, and `VisitThanks` playing once a session.

## Colors

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#1e201b` | same | Footer, `Signup` and skip link background, selection text |
| `--on-ink` | `#f5f2ea` | same | Text on `--ink` |
| `--gold-light` | `#c7b99f` | same | Footer links, `Signup` accents, selection background |
| `--leaf` / `--leaf-deep` | `#a9b99b` / `#7d8c6f` | same | `Branch` leaves on `--ink` |
| `--bg` | `#f5f2ea` | `#171814` | Page, header and drawer background |
| `--surface` | `#faf9f5` | `#1f201b` | Form fields |
| `--wash` | `#ede9df` | `#25261f` | Picture placeholders, inline code, `UpdateNote`, `Feedback` |
| `--border` | `#dcd8ce` | `#36372f` | Hairline rules and borders |
| `--gold` | `#c7b99f` | `#8a7e66` | Decorative only: left bars, numerals, separators, the sprig placeholder |
| `--text` | `#242720` | `#e6e3da` | Headings, body text, section rules |
| `--text-2` | `#6b6a63` | `#a6a49b` | Secondary text, metadata |
| `--bamboo` | `#5a6851` | `#a9b99b` | Links, labels (`.kicker`), current nav link, focus outline, `ReadingProgress` |
| `--bamboo-dark` | `#3f4a38` | `#cbd6bf` | Link hover |
| `--seal` | `#8c302b` | `#d98a80` | Small marks only: the seal, the "Bài nổi bật" eyebrow, the pull quote tick, the `ShareLinks` wax seal |

Tokens are full colors, switched with `light-dark()`: use `var(--text-2)`. The footer stays dark in both schemes, so use `--on-ink`, not `--bg`, for text on `--ink`.

**Text rule:** the brief's secondary text `#77766f` (4.08:1) and bamboo `#65745b` (4.47:1) miss AA on `--bg`, so text uses the darker steps above: `--text-2` 4.85:1, `--bamboo` 5.31:1, `--seal` 7.30:1, `--text` 13.54:1. `--gold` (1.73:1) and `--border` are never text. In dark, `--text-2` is 7.14:1 and `--bamboo` 8.58:1 on `--bg`.

**Color scheme:** system by default. `ThemeSwitch` pins light or dark by storing `color-scheme` in `localStorage` and setting `<meta name="color-scheme">`, which `tokens.css` maps to the `color-scheme` property. An inline script in `BaseHead` applies it before the first paint. Without `light-dark()` (Safari below 17.5) the site stays light.

## Typography

| Role | Font | Weights | Variable |
|---|---|---|---|
| Body, UI, metadata | Be Vietnam Pro, `sans-serif` | 400, 600 (`strong`, labels, buttons) | `--font-body` |
| Headings, wordmark, standfirsts, pull quotes | Newsreader, `serif` | 400, 500 (`h1`, wordmark, lead titles), italic 400 | `--font-heading` |
| `ShareLinks` thanks letter only | Patrick Hand, `cursive` | 400 only | `--font-hand` |

Loaded with Astro Fonts (Fontsource), subsets `latin-ext`, `latin`, `vietnamese`, in that order: the last declared face wins overlapping glyphs, so Vietnamese text doesn't download `latin-ext`. Only regular weight 400 of `latin` and `vietnamese` of the body and heading fonts is preloaded. Patrick Hand isn't, so it loads when the letter first opens.

| Role | Size |
|---|---|
| Body | `1.0625rem` (17px) below `40rem`, `1.125rem` (18px) from `40rem`; line height 1.7, 1.8 in `.prose` |
| `.prose` paragraphs | `1.1em` apart (about 19-20px) |
| `h1` (post title) | `clamp(2rem, 1.5rem + 2vw, 2.75rem)` (32-44px), weight 500, `lining-nums`, line height 1.25 |
| `.prose h2` / `h3` | `clamp(1.5rem, …, 1.75rem)` (24-28px) / `clamp(1.25rem, …, 1.375rem)` (20-22px) |
| Standfirst | Newsreader italic: `clamp(1.1875rem, …, 1.375rem)` on posts, `1.25rem` on list pages and in `PostLead` from `56rem` |
| Pull quote (`.prose blockquote`) | Newsreader italic, `clamp(1.3125rem, …, 1.625rem)`, line height 1.45 |
| Home tagline | `clamp(2.375rem, 1.5rem + 4vw, 5rem)`, line height 1.1 |
| Pillar page `h1` | `clamp(2.5rem, 1.75rem + 3.5vw, 4.5rem)` |
| Section titles (home, pillar) | `1.75rem` |
| `PostLead` title | `clamp(1.75rem, 1.375rem + 1.5vw, 2.5rem)`, weight 500 |
| `PostRow` title / standfirst | `1.25rem` / `0.9375rem`, `1.5rem` / `1rem` from `40rem` |
| `PostCard` title / standfirst | `1.3125rem` / `0.9375rem` |
| `PostTile` title | `1.125rem` |
| Wordmark | `1.1875rem` uppercase, `0.1em` tracking; the site name under it `0.6875rem`, `0.16em` |
| `.kicker` (labels) | `0.75rem`, weight 600, uppercase, `0.08em` tracking, `--bamboo` |
| `.meta` | `0.8125rem`, `--text-2` |
| Nav, byline, tags, footer | `0.875rem` |
| `Signup` heading | `clamp(1.5rem, 1.25rem + 1.25vw, 2rem)` |
| `VisitThanks` time / message | `clamp(2.5rem, 2rem + 2vw, 3.5rem)` body font, tabular numerals / `1.25rem` heading font |
| `ShareLinks` thanks date / title / other text | Handwriting font: `1rem` in `--text-2` / `1.5rem` / `1.1875rem`, the signature in `--text` |

Headings use `text-wrap: balance`; `.prose` paragraphs, list items and quotes use `pretty`.

## Layout

- Content column (`main`, `.wrap`): max `48rem` with `1rem` inline padding, `1.5rem` from `40rem`, so text is at most `45rem`.
- Wide column (`.wrap-wide`, `wide` prop of `BaseLayout`): max `74rem`, for header, footer, and the home, pillar, list and post pages.
- Section breaks: a full-strength `1px solid var(--text)` rule opens each home and pillar block; `1px solid var(--border)` hairlines split entries inside a block.
- Home (`index.astro`), in order: statement (a dateline between hairlines, with today's date from the visitor's clock, absent without JS; the `h1` holds the site name as a kicker and the tagline; then motto and description, `7fr 5fr` from `56rem`), `PostLead` (the newest `featured` post, or else the newest post), "Bài viết mới" (`1fr 3fr` from `56rem`, the narrow column sticky, up to five `PostRow`s), "Hai chuyên mục" (two columns from `56rem`, the second `4rem` lower: picture 3:2, kicker, name, motto, every topic, counts), "Bài chọn lọc" (other featured posts as numbered `PostCard`s in one, two or three columns), then the author's note (seal, bio and a maxim from the "Lời tự răn", in its own column from `56rem`). Blocks with nothing to show are left out. `Signup` follows, as on every page.
- Pillar page (`[pillar]/index.astro`): a masthead, `7fr 5fr` from `56rem` and mirrored for the second pillar (picture first): kicker "Chuyên mục 01", `h1`, motto, intro, counts; picture 4:5 (3:2 below `56rem`) with its caption. Then the topics as a numbered list (one column, two from `40rem`, three from `64rem`), each entry one link with its description and count; "Bài nổi bật" (`PostLead`); "Bài viết mới nhất", every post of the pillar as `PostRow`s, with a search field and a topic select that filter the list in place (search ignores case and Vietnamese marks) and a polite status line. Without JS the form is hidden and the full list shows.
- List pages (`ListLayout`: topics, tags, all posts): intro (kicker link to the parent, `h1`, standfirst, count), with the topic's "Bàn về" points beside it from `56rem`; then `PostRow`s up to `56rem` wide, split by hairlines, and `Pagination`.
- Post page (`PostLayout`): header (label, `h1`, standfirst, `PostMeta`) and body in the `45rem` column; the hero (2:1) up to `64rem`, edge to edge below `40rem`, with its caption under the column. From `64rem` the body sits in a three-column grid (`1fr 45rem 1fr`, `2.5rem` gaps): `ShareLinks` and `TimeOnPage` pinned on the left, the `Toc` pinned on the right (max `15rem`). After the body: references, tags, then `PostFeedback`, `AuthorBio`, `RelatedPosts` and `PrevNext` in the same column.
- `main` block padding: `3rem`, or `2rem` at `max-width: 720px`.
- `body` is a column flexbox with `min-height: 100dvh`, keeping the footer at the bottom. `.first-screen` wraps `main` and `Signup` with `min-height: calc(100svh - 3.71875rem)`, the header's height, so update it if the header's height changes.
- Nav breakpoint: drawer below `60rem`, row from `60rem`.
- Spacing has no tokens. Use these `rem` values: `0.25 0.5 0.75 1 1.25 1.5 2 2.5 3 3.5 4`.

## Shapes

- Rules: `1px solid var(--border)` hairlines, `1px solid var(--text)` section breaks. Left bars: `3px solid var(--gold)`.
- Radius: `0` everywhere (images, fields, buttons), except `pre` and inline code (`2px`), and the round `ShareLinks`, `TimeOnPage` and `ScrollTop` buttons, the wax seal, the toast and bubbles.
- Crops: post hero 2:1; `PostLead` 3:2, 4:3 from `56rem`; `PostCard` 3:2; `PostRow` square, 4:3 from `40rem`; `PostTile` square; pillar masthead 4:5 (3:2 below `56rem`); home pillar pictures 3:2.

## Components

Layouts: `BaseLayout` (shell, passing `jsonLd` and article times to `BaseHead`), `PageLayout` (static), `ListLayout` (paginated), `PostLayout` (post).

| Component | Notes |
|---|---|
| Menu buttons | Icon only, named with `aria-label`: three lines to open, a cross to close, in the same spot. `24px` icon, `1.5px` round stroke, in a `2.75rem` square, no border or fill. `--text`, `--bamboo` on hover, `Link focus` outline. Negative margin lines the icon up with the page edge |
| Nav links | `--text`, weight 400, `1.5rem` apart in the row. Hover draws the rule and sprig (see States) but keeps the color. `aria-current`: `--bamboo` only, with the rule and sprig on hover like the other links. Underlined in forced colors, where the color is lost |
| `Header` | Masthead: a `2rem` seal (the logo's sprig cut out of `--seal`) and the wordmark, `AUTHOR` in Newsreader uppercase over `SITE_NAME` in small `--text-2` capitals; the link is named for screen readers with both. Nav right: Trang chủ, the two pillars from `taxonomy.json`, Giới thiệu, never the topics. `--bg` background, `--border` bottom rule from `60rem` (transparent below, keeping the height). Pinned to the top (`position: sticky`, `z-index: 1`) from `60rem` wide and `34rem` tall; otherwise it scrolls away with the page. `html` has `scroll-padding-top: 5rem` while pinned, `1.5rem` otherwise. Below `60rem`: right drawer via Popover API, `--bg` background, width `min(20rem, 85vw)`; wrapped row without popover support |
| `ThemeSwitch` | One icon button, no border or fill, `--text` icon, `--bamboo` on hover. The icon shows the current mode and each click moves to the next: system, the opposite of the OS, then the other pinned scheme. Icons: half-filled circle (system), sun, moon. Negative margins line the icon up with the links. Last in `.site-nav`: at the end of the row from `60rem` (`2.25rem`), under the links in the drawer (`2.75rem`). Hidden without JS |
| `Footer` | `--ink` background, `--on-ink` text, `--gold-light` links, `--on-ink` on hover. Sets `color-scheme: dark`. Three bands split by tone: `Signup` on `--ink`, then the links on `--on-ink` mixed 6% into `--ink`, then the legal row back on `--ink`. Link band (auto-fit, min `12rem`): the wordmark with tagline and motto, then one column per pillar (its name links to the pillar, then its topics), then "Về trang". Legal row in `--on-ink` at 75%: copyright, and a designer credit linking to `happier.io.vn` in a new tab, at the far end from `60rem` |
| `Signup` | Band above `Footer`, same `--ink` background, `color-scheme: dark`. Text left and form right from `60rem`, top-aligned so the eyebrow and label share a line and the heading starts level with the input, stacked below. Visible label, `--on-ink` square input with a placeholder (`--ink` mixed 65% into `--on-ink`, 5.59:1), `--gold-light` square button with `--ink` text and weight 600 (`--on-ink` on hover), both min height `3rem` and `1rem` text. Submitting opens the reader's mail app with a prefilled `mailto:` to `CONTACT_EMAIL` in `consts.ts`, then shows that address as a text with a `3px` left bar in case no app opens. The error shows after interaction (`:user-invalid`) as text with a `3px` left bar and replaces the browser's bubble. Without JS (`@media (scripting: none)`) the form is hidden and a `<noscript>` line links the address, since the `mailto:` lives in `data-mailto`: Chrome reports one in `action` as mixed content. |
| `Branch` | Top of `Signup`, hidden from screen readers. A `1px` `--gold` rule fades in from the column's left edge and runs into a `256x64` stem with the logo's leaves in two bamboo greens (`--leaf`, `--leaf-deep`), keeping its size on any width. When on screen it grows once, about 2.5s: rule, stem, then leaves in turn. No script and print show it grown; no motion under `prefers-reduced-motion` |
| `PostLabel` | The pillar and topic as `.kicker` links split by a `--gold` slash; `topicOnly` leaves out the pillar on a pillar's pages, `plain` sets them as text. Positioned above a card's covering link (`z-index: 2`), so both stay their own links. No sprig, which would cover the slash |
| `Thumb` | A post's picture in a frame whose ratio the caller sets; the image covers it, served as AVIF with a WebP fallback. Without a hero image: `--wash` with the sprig in `--gold`. Hovering the card's `.title` link scales the image to `1.03` over 500ms, hover only and off under `prefers-reduced-motion` |
| `PostLead` | The editor's pick: picture and text side by side from `56rem` (`7fr 5fr`, `2.5rem` gap), stacked below. Optional seal-red eyebrow with a `1.5rem` tick ("Bài nổi bật"), `PostLabel`, title, italic standfirst, date and reading time. The title's link covers the block (focus outline `0.5rem` outside) |
| `PostRow` | A list entry: label, title, standfirst (clamped to 3 lines), date and reading time, with a small picture on the right (`5.5rem` square, `13rem` at 4:3 from `40rem`). No frame: the list draws hairlines between entries. The title's link covers the row |
| `PostCard` | A column in a selection: optional `--gold` numeral (`01`), picture 3:2, label, title, standfirst, reading time at the foot. The title's link covers the card |
| `PostTile` | A compact post row with no frame or background, at any width: a `6rem` `Thumb` (`1:1` at least, stretching with a taller text column), a `1rem` gap, then label, title and date. `alignDate` pins the date to the foot instead, so dates line up across a row of tiles. The title's link covers the tile, with a `2px` `--bamboo` focus outline around it |
| `PostMeta` | The post's byline between two hairlines: "Bài viết của" and `AUTHOR` (weight 600, linking to `/gioi-thieu/` with `rel="author"`), then date, update date, reading time and the optional confidence level, split by `--gold` dots |
| `ReadingProgress` | A `3px` `--bamboo` bar fixed at the top of the screen (`z-index: 2`), filling from the left as `.post-body` is read: a scroll-driven animation on a named view timeline (`contain 0%` to `contain 100%`), or a scroll listener where unsupported. Hidden from screen readers and in print |
| `UpdateNote` | `--wash` background, `--gold` left bar |
| `ShareLinks` | Facebook link, copy-link button, thanks button (heart icon): round, `1px` `--border` border, `--text` stroke icon, `--bamboo` on hover, no brand colors or counts. A row at the end of the post below `64rem` (`2.75rem`), a pinned column left of the post from `64rem` (`2.25rem`). The copy result shows for 4s in a toast centered `1.5rem` above the bottom edge: `--text` background, `--bg` text at `0.875rem` (inverted in both schemes), `--gold` check on success, no icon on failure, no shadow or close button, clicks pass through. It fades and rises `0.5rem` over 220ms (fade only under `prefers-reduced-motion`). A separate `.sr-only` `role="status"` announces the same text. Each click on the thanks button adds a heart, stored per post in `localStorage` (`hearts:<path>`) in this browser only. A hearted post fills the icon with `--gold` and shows the count in a `1rem` `--bamboo` badge with `--bg` text at `0.75rem`, on the button's top right corner, up to `99+`. The button opens a modal `dialog` set as a letter rising out of an open envelope, centered, `min(28rem, 100vw - 2rem)` wide, square, no shadow. Behind it is plain `--wash`. The letter is `--bg` with `1px` dashed rules of `--gold` at 60% every `1.875rem`. All its text is handwritten, with a `1.875rem` line height and blank lines of the same size, so it sits on the rules. The envelope is `--gold` mixed into `--bg`, with `1px` `--gold` edges: 65% for the back behind the letter and the top flap, seen only during the animation, 45% for the side flaps and 30% for the front flap with its rounded tip, in `2.5:1`, with no pattern. In order: today's date ("Ngày 5 tháng 11 năm 2026") at the right, the greeting "Gửi bạn,", the `h2` "Cảm ơn bạn đã thả tim", with "lần thứ n" from the second heart, a blank line, a random wish, then at the right "Thân mến," with `SITE_TITLE` as the signature, and a `Đóng` button on the front flap, set as a wax seal: a slightly uneven circle, `3.5rem` wide and down to `3rem` on the narrowest phones, in `--bamboo` (`--bamboo-dark` on hover) with a `1px` `--bg` ring inside its edge and handwritten `--bg` text. The text stops above the flaps. If the letter doesn't fit, it scrolls out of the envelope, which stays pinned with the button. Below `34rem` of viewport height the envelope scrolls with the letter instead, since it would leave too little room to read. It always opens at the top of the letter. The 40 wishes live in `src/lib/thanks-messages.ts`, and the same one never shows twice in a row. `--ink` at 60% behind it. It closes with the button, Esc or a click outside. It opens in 650ms: a closed envelope fades in, its top flap lifts (300ms), then the letter unfolds up out of it from a hinge at its foot (300ms) as the paper behind fades in. Every way of closing runs this back in about 490ms before the dialog closes, in all browsers. Once open, all but the date types itself out in order, 20ms a character with a 150ms pause between lines, hidden with a transparent `::highlight` so nothing reflows and screen readers get the whole text. A click anywhere skips it. Browsers without the Custom Highlight API show the text at once. Fade only and no typing under `prefers-reduced-motion`. Nothing is sent to a server. No third-party scripts. Buttons are hidden without JS |
| `TimeOnPage` | Under `ShareLinks`: at the far end of their row below `64rem`, under the pinned column from `64rem`, `1rem` below the buttons. A round button like theirs (`2.75rem`, `2.25rem` from `64rem`, `1px` `--border` border, `--bamboo` on hover) holding a `26px` hourglass: two triangles with a `1.5px` `currentColor` outline and `--gold` sand that nearly fills a bulb, with dashed grains falling through the neck. The sand drains smoothly over 15s, counting only while the tab is in front, then the glass turns over in 900ms and starts again. Hovering with a mouse or clicking opens a chat bubble (`popover`): "Bạn đã ở đây 3 phút 12 giây", updating every second, with the toast's colors, type, radius and 220ms rise (fade only under `prefers-reduced-motion`), and a tail pointing at the button, above it and right-aligned below `64rem`, to its right from `64rem`. Hovering closes it 200ms after the pointer leaves both the button and the bubble, and a click pins it. Clicking outside or Esc closes it. It isn't a live region, so it never interrupts. Without anchor positioning it sits where the toast does, with no tail. Static, half-drained hourglass under `prefers-reduced-motion`. Absent without JS and in print |
| `ScrollTop` | On every page, once scrolled past `12.5rem`, so a page with less to scroll never shows it. Round, fixed `1rem` from the right and `1.5rem` from the bottom, `1px` `--border` border, `--bg` background so it stays clear over text and the `--ink` bands, `--text` stroke arrow, `--bamboo` on hover. `2.75rem`, `2.25rem` from `64rem`. It fades and rises `0.5rem` over 220ms (fade only under `prefers-reduced-motion`, which also makes the scroll instant). Clicking it moves focus to the brand link, for keyboard readers. Absent without JS and in print |
| `Toc` | Only on posts with 3 or more `h2`/`h3`. `0.875rem`, `--text-2` links, `h3` indented. Current section: `--bamboo` and a `3px` `--gold` left bar, tracked with `scroll-target-group`, or a scroll listener where unsupported. A closed `details` under the post header below `64rem`, a pinned column right of the post from `64rem` |
| `StarRating` | Five native radios hidden with `.sr-only`, shown as `32px` line stars in `3rem` tap targets (`small`: `20px` stars, `2.25rem` wide and `3rem` tall) with a `1.5` `--bamboo` stroke; stars up to the chosen or hovered one fill with `--bamboo` over 150ms, and the hovered one scales to `1.1`, no motion under `prefers-reduced-motion`. Negative margins line the outer stars up with the surrounding text |
| `PostFeedback` | After the post, before `AuthorBio`. No frame or rules: the question, then `small` `StarRating` `1rem` after it, wrapping below it on narrow screens. Choosing a star reveals an optional textarea (up to 300 characters, as the subject and body also carry the post's title and URL), a `--text-2` note and the button, with the `Feedback` field and button styles at `0.875rem`. They fade and rise `0.25rem` over 240ms, also growing the block's height where `interpolate-size` is supported, no motion under `prefers-reduced-motion`. The field's label asks what was missing for 1-3 stars and what helped most for 4-5. The button can't appear without a rating, so there is no error state. Submitting opens the `mailto:` as in `Feedback`, then shows the address with a `3px` left bar. Same no-JS fallback as `Signup`. Absent in print |
| `Feedback` | A `.ruled` form on `--wash`, under the contact text on `/lien-he/`, with `--text` notes. Rating: `StarRating`. Message: optional textarea, up to 500 characters so the `mailto:` URL stays under the roughly 2000 that some systems accept. `--bg` background, `1px` `--text-2` border, since `--gold` is too faint for a field's edge, square, growing with its text up to `16lh`. Button: square, `--bamboo` background, `--bg` text, weight 600, min height `3rem`, `--bamboo-dark` on hover. Submitting opens the reader's mail app with a prefilled `mailto:` to `CONTACT_EMAIL`, then shows that address with a `3px` left bar, as in `Signup`. Submitting without a rating shows the error, also with a left bar, and focuses the first star. Same no-JS fallback as `Signup` |
| `VisitThanks` | Wraps a section, on `/lien-he/` the feedback heading and form, which stays transparent while a thanks plays in its space, so nothing below moves. When the thanks is on screen: `--text-2` "Bạn đã ở đây", the time with the tab in front counting up over 900ms and then ticking, a `1px` `--gold` rule drawing with the sprig growing from its end, the message at 1.1s. At 4s it fades and the section fades in and rises `0.5rem`. It starts once wholly on screen below the header (half is enough if it can't fit), then stays in view while the page scrolls through the section's space (`position: sticky`) and leaves with the section, so it never covers the footer, in a `--bg` panel with a `1px` `--border` border. Plays once a session (`sessionStorage`). Focus inside the section ends it at once, and screen readers skip it and reach the section directly. No script and print show the section alone. Under `prefers-reduced-motion`: final time, fades only |
| `AuthorBio` | After the post, before `RelatedPosts`. No frame or rules: the `4rem` seal, then a `--text-2` "Tác giả" label, `AUTHOR` as the `h2`, `AUTHOR_BIO` from `consts.ts` at `1rem`, and a `rel="author"` link to `/gioi-thieu/`. The bio and link sit under the seal below `40rem`, beside it from `40rem` |
| `RelatedPosts` | `h2`, then one `PostTile` per row, no frame, with a `1px` `--border` rule between rows, `1.25rem` from each. Leaves out the posts already in `PrevNext` |
| `PrevNext` | Two `alignDate` `PostTile`s ("← Bài trước", "Bài sau →") `1.5rem` below a `1px` `--border` rule, no frame. Stacked `1.5rem` apart below `40rem`, side by side `3rem` apart from `40rem`. The heading is `.sr-only`. At either end of the list a `--text-2` note takes the empty cell from `40rem`; below that it is dropped |
| `Pagination` | Three-column grid: previous, `Trang x/y`, next. Links are at least `2.75rem` tall |

## States and accessibility

- Tap targets: post tags and buttons at least `2.75rem` tall, inline `Toc` links `0.5rem` block padding.
- Links, nav included, have no underline at rest and rely on color. On hover (`links.css`) the color changes to `--bamboo-dark`, a 1px `currentColor` rule draws from the left (300ms), then the logo's sprig (`public/sprig.svg`, as a mask) grows from its end (260ms, 180ms delay). Hover only under `(hover: hover)`; no animation under `prefers-reduced-motion`. A link that is a block or flex item wraps its text in `.link-line`. In running text in `.prose` the sprig is off, since it would cover the text; these links keep the rule at rest, because color alone doesn't set them apart, and it thickens to 2px on hover. `Toc` and `PostLabel` links and the wordmark also have no sprig, and `ShareLinks` has neither rule nor sprig. The skip link opts out.
- Link focus: `outline: 2px solid var(--bamboo)`, offset `2px`.
- Skip link is hidden until focused and sits above the pinned header and `ReadingProgress` (`z-index: 3`). Use `.sr-only` for screen-reader-only text.
- Page transition: native `@view-transition` in `transitions.css`. Header and footer swap instantly; `main` fades in over 220ms and rises `0.5rem`. The header has its own transition name so `main` never paints over it. Off under `prefers-reduced-motion`; Firefox navigates instantly. `<link rel="expect">` in `BaseHead` waits for `#main`, so keep that id in the layout.
- `lang="vi"`; dates use `vi-VN` and `Asia/Ho_Chi_Minh`.
- Search and filter on pillar pages: visually hidden `label`s, `role="search"`, and a `role="status"` line with the result count.

## Brand

- Brand `AUTHOR` (Tư Mã Đại Nhân), site `SITE_NAME` (Trúc Chí Lập Thân), tagline `SITE_TAGLINE`, motto `SITE_MOTTO`, all in `src/consts.ts`.
- The seal is CSS: `--seal` masked by `public/sprig.svg` with `exclude`, in `Header`, `AuthorBio` and the home author's note. `Branch` repeats the logo's leaf paths.
- `theme-color` in `BaseHead.astro` matches `--bg` in each scheme; update it with the palette.
- Pictures: post heroes in each post's folder (`hero.jpg`, 2:1, at least 1600px wide), pillar pictures in `src/assets/pillars/<slug>.jpg` (4:5). Sources in `docs/image-credits.md`. `heroCredit` is the caption under the hero, `heroAlt` its description.
- UI copy is Vietnamese, first person, calm and modest.

## Known gaps

- `public/logo.svg`, `favicon.svg`, `logo.png` (the Open Graph fallback) and `apple-touch-icon.png` still use the old gold-on-black palette.
- Footer focus outline: stays `#5a6851` without `light-dark()` (Safari below 17.5), low contrast on `--ink`.
- `pre` stays dark in both schemes and uses Astro's default code theme.
- The pillar page lists every post of the pillar without pagination; past a few hundred posts it needs paging or a search index (Pagefind).
- Pillar slugs are URL roots, so the CMS can rename a pillar but not add or remove one.
