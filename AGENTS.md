# Repository Guidelines

## Project Structure & Module Organization

This repository is a Hugo theme. Core theme templates are in `layouts/` (`_partials/`, `_shortcodes/`, and page templates such as `single.html`). Frontend source lives in `assets/` (`scss/` and `ts/`), while static files are in `static/` and image resources in `images/`.

The runnable example site is in `demo/` with its own `config/`, `content/`, and generated `public/` output. Theme metadata and localization are in `config/`, `data/`, and `i18n/`. Build automation for Cloudflare Workers is in `.ci/build.sh`, with deployment settings in `wrangler.toml`.

## Build, Test, and Development Commands

- `cd demo && hugo server --gc --themesDir=../.. --disableFastRender`: run the demo locally with the theme from this repository (`debug.bat` wraps this on Windows).
- `cd demo && hugo --gc --minify --themesDir=../.. --theme=repo`: produce a production build of the demo site.
- `pnpm install`: install formatting tooling.
- `pnpm exec prettier . --check`: verify formatting.
- `pnpm exec prettier . --write`: apply formatting fixes.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF line endings, 4-space indentation by default. Prettier is the formatter (`prettier-plugin-go-template` for Hugo HTML templates).

For `*.js` and `*.ts`, Prettier enforces tabs, single quotes, and `printWidth: 120`. Keep template and partial names descriptive and aligned with Hugo conventions (for example, `layouts/partials/article/components/...` style nesting).

## Testing Guidelines

There is no dedicated automated test suite yet. Validate changes by:

- Running the demo server and checking affected pages/components.
- Building with `hugo --gc --minify` to catch template and asset pipeline issues.
- Running Prettier checks before opening a PR.

## Key Partials & Components

### Pagination (`layouts/_partials/pagination.html`)

Uses Hugo's built-in Paginator API. Key variables: `$.Paginator` (the paginator object), `.TotalPages`, `.PageNumber`, `.Pagers` (slice of all page paginators), `.Prev`/`.Next`, `.First`/`.Last`, `.URL`.

The pagination renders: **[←] [1] [...] [start…end] [...] [N] [→]** where the middle window `[start, end]` always covers exactly 3 pages so there are always 5 page numbers visible (when total > 5). Window clamping rules:

- Default: `start = curr-1`, `end = curr+1`
- Near start (`start <= 1`): pin to `[2, 4]`
- Near end (`end >= total`): pin to `[total-3, total-1]`
- Total ≤ 5: show all middle pages `[2, total-1]`, no ellipsis

The `hide-on-mobile` class is applied to middle pages whose distance from the current page is > 1; corresponding CSS is in `assets/scss/partials/pagination.scss` (hidden below the `md` breakpoint via the `respond(md)` mixin).

### SCSS Structure (`assets/scss/`)

- `style.scss` — main entry point, imports all partials
- `partials/` — component-level styles (e.g., `pagination.scss`, `article.scss`)
- `variables.scss` — CSS custom properties and Sass variables
- `breakpoints.scss` — defines responsive breakpoints; use the `respond(md)` mixin for tablet/desktop rules
- `custom/` — optional override files (e.g., neon/cyberpunk themes)

### Demo Site (`demo/`)

- `config/_default/hugo.toml` sets `pagerSize = 2` (only 2 posts per page) to make pagination easy to test with few posts.
- Override this temporarily to a larger value when testing scenarios with many pages.
- The demo uses `--themesDir=../..` so it picks up live edits from the repo root without symlinking.

### i18n (`i18n/`)

String keys follow Hugo's i18n format. When adding new UI strings to templates, add corresponding keys to all locale files (at minimum `en.toml`), then propagate to others as needed.

### Tile Card Overlay (`layouts/_partials/article-list/tile.html`)

Tile cards (used on the archives page, subsection lists, and related-content) layer two color sources:

1. **CSS fallback** — `.article-list--tile article.has-image .article-details` sets `background-color: rgba(0,0,0,0.25)` when the card has an image.
2. **Inline gradient** — `tile.html` writes a `style="background: linear-gradient(...)"` on `.article-details` when Hugo's image processing can extract palette colors from a local image resource (`$image.Resource`). The inline `background` shorthand supersedes the CSS `background-color` entirely when present.

**CSS layout rules for `.article-list--tile article`:**

- `position: relative` + `overflow: hidden` + `border-radius` on the `article` element handles all corner clipping — child elements must **not** repeat `border-radius`.
- `.article-image` is `position: absolute` (behind). `.article-details` is `position: relative` and appears later in the DOM, so it naturally paints on top. **Do not add `z-index`** to `.article-details`: creating an independent stacking context inside a parent with `overflow:hidden` + `border-radius` + a `box-shadow` transition causes Firefox to re-composite the rounded-overflow clip layer per stacking context during the transition repaint cycle, making the overlay background briefly disappear on hover.

### Custom Themes (`assets/scss/custom/`)

- `_common.scss` — shared animations/interactions; defines the `card-targets` mixin that targets all card-like elements at once.
- `themes/neon/` — dark-mode neon/purple style; activated by `[data-scheme="dark"]`.
- `themes/cyberpunk/` — light-mode cyberpunk 2077 style; activated by `[data-scheme="light"]`.
- Both theme files import a `_index.scss` entry point and are brought in via `custom.scss` (last import in `style.scss`, so they can override anything above).

### Image Processing & Color Extraction (`layouts/_partials/helper/image.html`)

Returns a dict with `Resource` (possibly resized/converted), `ColorResource` (always the original, used for palette extraction), `Permalink`, `Width`, `Height`, and `Local`. Remote images return `Resource: nil` and `Local: false`. Color extraction in `tile.html` is only attempted when `$image.Resource` is non-nil (i.e., local images only).

### SCSS Import Order (`assets/scss/style.scss`)

Imports follow this order: breakpoints → variables → grid → external (normalize) → partials (menu, article, widgets, footer, pagination, sidebar, base, layout/\*) → general → custom. Later imports win on specificity ties, so `custom/` overrides always take effect.

## Commit & Pull Request Guidelines

Recent history follows Conventional Commit prefixes such as `feat:`, `fix:`, and `chore:`. Continue this format and keep each commit focused.

PRs should include:

- A clear summary of user-visible and technical changes.
- Linked issue(s) when applicable.
- Screenshots/GIFs for UI or layout updates.
- Confirmation that local Hugo build and formatting checks passed.

# layouts/ — Hugo Templates

## Directory Structure

```
layouts/
├── baseof.html                  # Root shell (html/body, 3-column flex layout)
├── home.html                    # Homepage: paginated article list
├── single.html                  # Single post page
├── list.html                    # Section / taxonomy / term list
├── archives.html                # Archives page (categories as tiles + posts by year)
├── 404.html                     # 404 page with inline search
├── rss.xml                      # RSS 2.0 feed
├── page/
│   ├── search.html              # Dedicated search page
│   └── search.json              # JSON search index output format
├── _markup/                     # Render hooks (Goldmark)
├── _partials/                   # Reusable partials
└── _shortcodes/                 # Content shortcodes
```

---

## Page Templates

### `baseof.html`

Root shell. Defines the HTML skeleton and three named blocks other templates fill:

- `{{ block "main" }}` — page content
- `{{ block "right-sidebar" }}` — optional right sidebar
- `{{ block "body-class" }}` — extra CSS classes on `<body>`

Sets `.extended` container class when right sidebar widgets are configured, otherwise `.compact`. Always includes `head/head.html`, `head/colorScheme.html`, `sidebar/left.html`, and `footer/include.html`.

### `home.html`

Homepage. Paginates site pages via `helper/paginator.html`, renders them with `article-list/default`, and renders `pagination.html`. Right sidebar scope: `"homepage"`.

### `single.html`

Single post. Fills `body-class` block — checks TOC/widget availability via `.Scratch`. Main block: `article/article.html`, then conditionally `article/components/links`, `article/components/related-content`, comments, `footer/footer`, `article/components/photoswipe`, `article/components/mermaid`.

### `list.html`

Section/taxonomy/term list. Shows a section card header, optional subsection tile strip, paginated compact article list, and pagination.

### `archives.html`

Shows taxonomy terms as tile cards, then all site pages grouped by year. Year element IDs are anchor targets for the archives widget.

### `404.html`

404 page. Embeds inline search form pre-filled with words parsed from the bad URL (split on `/` and `-`). Loads `ts/search.tsx`.

### `rss.xml`

RSS 2.0 feed. Page source via `helper/pages.html`. Supports `RSSFullContent` param. Optionally prepends featured image to item description.

---

## Render Hooks (`_markup/`)

| File                            | Purpose                                                                                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `render-heading.html`           | Adds anchor ID and optional `#` link (controlled by `article.HeadingAnchor` param)                                                  |
| `render-link.html`              | Adds `class="link"` to all links; adds `target="_blank" rel="noopener"` for external URLs                                           |
| `render-image.html`             | Processes images via `helper/image`; adds `gallery-image` class + `data-flex-grow`/`data-flex-basis` for CSS flexbox gallery layout |
| `render-codeblock.html`         | Delegates to Hugo's `transform.HighlightCodeBlock`                                                                                  |
| `render-codeblock-mermaid.html` | Emits hidden `<pre class="mermaid">` and sets `.Page.Store "hasMermaid" true`                                                       |
| `render-blockquote.html`        | Handles GFM alert blockquotes (`> [!NOTE]` etc.) — renders `<blockquote class="alert alert-<type>">` with icon header               |

---

## Partials (`_partials/`)

### `article/`

| File                              | Purpose                                                                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `article.html`                    | Top-level `<article>` wrapper; orchestrates header, inline TOC `<details>`, content, footer, mermaid, math                                  |
| `components/header.html`          | Featured image (via `helper/image`) + article details metadata                                                                              |
| `components/details.html`         | Category pills, title, subtitle, date, reading time, translation links, tags (in list context)                                              |
| `components/content.html`         | Renders `.Content`, wraps `<table>` in `.table-wrapper` for horizontal scroll                                                               |
| `components/footer.html`          | Tags, license block, last-modified date (only if Lastmod ≠ Date)                                                                            |
| `components/tags.html`            | Tag links inside `.article-tags`                                                                                                            |
| `components/toc.html`             | **Return partial.** Strips outer `<nav>` wrapper from Hugo's `.TableOfContents`, returns inner HTML. Used by both inline TOC and TOC widget |
| `components/related-content.html` | Horizontally scrollable tile strip of up to 5 related articles                                                                              |
| `components/links.html`           | Renders `links` front-matter array as a compact list                                                                                        |
| `components/math.html`            | Loads KaTeX via `helper/external`, initializes `renderMathInElement`                                                                        |
| `components/mermaid.html`         | Outputs `#mermaid-modal` HTML, loads Mermaid from CDN, imports `ts/mermaid.ts` as ES module                                                 |
| `components/photoswipe.html`      | Loads `ts/gallery.ts`, initializes PhotoSwipe when figure/gallery elements exist                                                            |

### `article-list/`

Three card variants — choose based on context:

| File           | Layout                                                                               | Used in                                                  |
| -------------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `default.html` | Full-width top image + metadata card                                                 | Homepage, section lists                                  |
| `compact.html` | One-line row: small thumbnail + title + date                                         | Section lists, archives, search results, archive widget  |
| `tile.html`    | Fixed 250×150–350px tile, absolute-positioned image fill, gradient overlay at bottom | Related content, subsections, archives/categories header |

**Tile gradient logic:** When `$image.Resource` is non-nil (local image), extracts `.Colors[0]` (vibrant) and `.Colors[1]` (darkMuted) from the image palette and writes an inline `linear-gradient` on `.article-details`. See `AGENTS.md` at the repo root for the stacking context caveat (no `z-index` on `.article-details`).

### `comments/`

`include.html` dispatches to the correct provider based on `site.Params.comments.provider`. Wraps the block in a consent placeholder when cookie consent is enabled. Supported providers (one file each in `provider/`): artalk, beaudar, cactus, comentario, cusdis, disqus, disqusjs, giscus, gitalk, remark42, twikoo, utterances, vssue, waline.

### `cookies/`

| File             | Purpose                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| `include.html`   | Renders banner + loads `ts/cookies.ts` (only when `cookies.enabled`)                                         |
| `banner.html`    | Cookie consent banner HTML: Accept/Deny buttons, optional Manage Preferences panel with category checkboxes  |
| `analytics.html` | Consent-gated Google Analytics — only appends GA script on `onCookieConsentChange` when `analytics === true` |

### `data/`

**Return partials** — call with `partial "data/..." .` and use the return value directly.

| File               | Returns                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| `title.html`       | Page title string; prepends "Page N - " on paginated pages; falls back to site title                 |
| `description.html` | Best available description: front-matter Description → Summary → site description → sidebar subtitle |

### `footer/`

| File                     | Purpose                                                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `footer.html`            | Site footer: copyright year range, "Built with Hugo / Designed by" attribution                                             |
| `include.html`           | Called from `baseof.html`; includes cookies, `components/script.html`, and `custom.html`                                   |
| `components/script.html` | Builds and includes `ts/main.ts` (deferred, fingerprinted); also includes `ts/custom.ts` if present (user extension point) |
| `custom.html`            | Empty — user extension point for custom footer HTML                                                                        |

### `head/`

| File                              | Purpose                                                                                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `head.html`                       | Complete `<head>`: charset, viewport, meta, title, canonical, preconnect, fonts, styles, OG, RSS, favicon, analytics                     |
| `colorScheme.html`                | Inline `<script>` before `<body>`: reads/sets `localStorage` and `document.documentElement.dataset.scheme` synchronously to prevent FOUT |
| `style.html`                      | Compiles `scss/style.scss` via Hugo SCSS pipeline, minifies, fingerprints                                                                |
| `preconnect.html`                 | `<link rel="preconnect">` for jsDelivr, Google Fonts                                                                                     |
| `custom-font.html`                | Loads Poppins (300/400/700) from Google Fonts                                                                                            |
| `custom.html`                     | Empty — user extension point for custom `<head>` HTML                                                                                    |
| `opengraph/include.html`          | Calls `base.html` and `twitter.html` OG providers                                                                                        |
| `opengraph/provider/base.html`    | Standard OG meta tags (title, description, url, image, article times, etc.)                                                              |
| `opengraph/provider/twitter.html` | Twitter card meta tags                                                                                                                   |

### `helper/`

**Return partials** — always call with `partial "helper/..." .` and capture the return value.

| File                  | Returns / Purpose                                                                                                                                                                                                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image.html`          | Returns `{Local, Resource, ColorResource, Permalink, Height, Width}`. Handles local images (via `.Resources.Get`), remote images (via `resources.GetRemote`), and SVGs. Resizes to max 2048px, converts to WebP, strips EXIF. `ColorResource` is always the original for palette extraction. |
| `color-from-str.html` | Returns `{BackgroundColor, TextColor, Hue}` — deterministic HSL colors from an FNV32a hash of the input string. Used for category pill colors.                                                                                                                                               |
| `pages.html`          | Returns the page collection for the current context (home → mainSections; section/taxonomy → filtered regular pages). Pipes through `pages-sort.html`.                                                                                                                                       |
| `pages-sort.html`     | Sorts by `Lastmod.Reverse` when `SortBy == "lastmod"`, otherwise default order.                                                                                                                                                                                                              |
| `paginator.html`      | Calls `.Paginate` on `helper/pages.html` result. Returns empty for non-list page kinds.                                                                                                                                                                                                      |
| `icon.html`           | Inlines `assets/icons/<name>.svg`. Build-time error if icon not found.                                                                                                                                                                                                                       |
| `external.html`       | Emits `<script>` or `<link>` tags from `site.Data.external.<Namespace>`. Used by `components/math.html` for KaTeX.                                                                                                                                                                           |

### `pagination.html`

Pagination nav. Only rendered when `TotalPages > 1`. Renders: `[←] [1] [...] [start…end] [...] [N] [→]`.

Window algorithm (always 3 middle pages when total > 5):

- Default: `start = curr-1`, `end = curr+1`
- Near start (`start <= 1`): pin to `[2, 4]`
- Near end (`end >= total`): pin to `[total-3, total-1]`
- Total ≤ 5: show all middle pages `[2, total-1]`, no ellipsis

Pages whose distance from current is > 1 get `.hide-on-mobile` (hidden below `md` breakpoint).

### `sidebar/`

| File         | Purpose                                                                                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `left.html`  | Sticky left sidebar: hamburger toggle, avatar, site name/description, social links, main nav (with active-state detection), language switcher, dark mode toggle |
| `right.html` | Iterates `site.Params.widgets.<scope>` (`"homepage"` or `"page"`), renders each widget via `partial "widget/<type>"`                                            |

### `widget/`

| File              | Purpose                                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `archives.html`   | Finds the archives page, groups site pages by year, shows up to `limit` (default 5) years with post counts                   |
| `categories.html` | Thin wrapper → delegates to `widget/taxonomy` with `taxonomy: "categories"`                                                  |
| `tag-cloud.html`  | Thin wrapper → delegates to `widget/taxonomy` with `taxonomy: "tags"`                                                        |
| `taxonomy.html`   | Generic taxonomy widget: top `limit` (default 10) terms by count as tag-pill links                                           |
| `search.html`     | Finds the search page by `layout: search`, renders a search form pointing to it                                              |
| `toc.html`        | Shown only when `.Context.Scratch.Get "TOCEnabled"` is true (set by `single.html`). Renders TOC via `article/components/toc` |

---

## Shortcodes (`_shortcodes/`)

| File            | Usage                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `bilibili.html` | `{{< bilibili BV1xx411c7mD >}}` — embeds Bilibili video (AV or BV number, optional part)               |
| `tencent.html`  | `{{< tencent vid >}}` — embeds Tencent Video player                                                    |
| `youtube.html`  | `{{< youtube id >}}` — embeds YouTube; respects Hugo Privacy.YouTube config; supports `autoplay` param |
| `video.html`    | `{{< video src="..." poster="..." autoplay=true muted=true >}}` — native HTML5 `<video>`               |
| `gitlab.html`   | `{{< gitlab snippetId >}}` — embeds GitLab snippet via CDN script tag                                  |
| `quote.html`    | `{{< quote author="..." source="..." url="..." >}}...{{< /quote >}}` — styled blockquote               |

All video embeds use `.video-wrapper` for 16:9 responsive sizing.

---

## Adding New Features

- **New page type:** Create a top-level template (e.g., `layouts/mytype.html`) filling the `main`/`right-sidebar`/`body-class` blocks.
- **New widget:** Add `layouts/_partials/widget/mywidget.html`; enable it in site config under `params.widgets.homepage` or `params.widgets.page`.
- **New comment provider:** Add `layouts/_partials/comments/provider/myprovider.html`; read config from `site.Params.comments`.
- **New shortcode:** Add `layouts/_shortcodes/myshortcode.html`.
- **i18n strings:** When adding UI text, add keys to all locale files in `i18n/` (minimum `en.toml`).
