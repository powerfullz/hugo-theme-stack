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

| File | Purpose |
|---|---|
| `render-heading.html` | Adds anchor ID and optional `#` link (controlled by `article.HeadingAnchor` param) |
| `render-link.html` | Adds `class="link"` to all links; adds `target="_blank" rel="noopener"` for external URLs |
| `render-image.html` | Processes images via `helper/image`; adds `gallery-image` class + `data-flex-grow`/`data-flex-basis` for CSS flexbox gallery layout |
| `render-codeblock.html` | Delegates to Hugo's `transform.HighlightCodeBlock` |
| `render-codeblock-mermaid.html` | Emits hidden `<pre class="mermaid">` and sets `.Page.Store "hasMermaid" true` |
| `render-blockquote.html` | Handles GFM alert blockquotes (`> [!NOTE]` etc.) — renders `<blockquote class="alert alert-<type>">` with icon header |

---

## Partials (`_partials/`)

### `article/`

| File | Purpose |
|---|---|
| `article.html` | Top-level `<article>` wrapper; orchestrates header, inline TOC `<details>`, content, footer, mermaid, math |
| `components/header.html` | Featured image (via `helper/image`) + article details metadata |
| `components/details.html` | Category pills, title, subtitle, date, reading time, translation links, tags (in list context) |
| `components/content.html` | Renders `.Content`, wraps `<table>` in `.table-wrapper` for horizontal scroll |
| `components/footer.html` | Tags, license block, last-modified date (only if Lastmod ≠ Date) |
| `components/tags.html` | Tag links inside `.article-tags` |
| `components/toc.html` | **Return partial.** Strips outer `<nav>` wrapper from Hugo's `.TableOfContents`, returns inner HTML. Used by both inline TOC and TOC widget |
| `components/related-content.html` | Horizontally scrollable tile strip of up to 5 related articles |
| `components/links.html` | Renders `links` front-matter array as a compact list |
| `components/math.html` | Loads KaTeX via `helper/external`, initializes `renderMathInElement` |
| `components/mermaid.html` | Outputs `#mermaid-modal` HTML, loads Mermaid from CDN, imports `ts/mermaid.ts` as ES module |
| `components/photoswipe.html` | Loads `ts/gallery.ts`, initializes PhotoSwipe when figure/gallery elements exist |

### `article-list/`

Three card variants — choose based on context:

| File | Layout | Used in |
|---|---|---|
| `default.html` | Full-width top image + metadata card | Homepage, section lists |
| `compact.html` | One-line row: small thumbnail + title + date | Section lists, archives, search results, archive widget |
| `tile.html` | Fixed 250×150–350px tile, absolute-positioned image fill, gradient overlay at bottom | Related content, subsections, archives/categories header |

**Tile gradient logic:** When `$image.Resource` is non-nil (local image), extracts `.Colors[0]` (vibrant) and `.Colors[1]` (darkMuted) from the image palette and writes an inline `linear-gradient` on `.article-details`. See `AGENTS.md` at the repo root for the stacking context caveat (no `z-index` on `.article-details`).

### `comments/`

`include.html` dispatches to the correct provider based on `site.Params.comments.provider`. Wraps the block in a consent placeholder when cookie consent is enabled. Supported providers (one file each in `provider/`): artalk, beaudar, cactus, comentario, cusdis, disqus, disqusjs, giscus, gitalk, remark42, twikoo, utterances, vssue, waline.

### `cookies/`

| File | Purpose |
|---|---|
| `include.html` | Renders banner + loads `ts/cookies.ts` (only when `cookies.enabled`) |
| `banner.html` | Cookie consent banner HTML: Accept/Deny buttons, optional Manage Preferences panel with category checkboxes |
| `analytics.html` | Consent-gated Google Analytics — only appends GA script on `onCookieConsentChange` when `analytics === true` |

### `data/`

**Return partials** — call with `partial "data/..." .` and use the return value directly.

| File | Returns |
|---|---|
| `title.html` | Page title string; prepends "Page N - " on paginated pages; falls back to site title |
| `description.html` | Best available description: front-matter Description → Summary → site description → sidebar subtitle |

### `footer/`

| File | Purpose |
|---|---|
| `footer.html` | Site footer: copyright year range, "Built with Hugo / Designed by" attribution |
| `include.html` | Called from `baseof.html`; includes cookies, `components/script.html`, and `custom.html` |
| `components/script.html` | Builds and includes `ts/main.ts` (deferred, fingerprinted); also includes `ts/custom.ts` if present (user extension point) |
| `custom.html` | Empty — user extension point for custom footer HTML |

### `head/`

| File | Purpose |
|---|---|
| `head.html` | Complete `<head>`: charset, viewport, meta, title, canonical, preconnect, fonts, styles, OG, RSS, favicon, analytics |
| `colorScheme.html` | Inline `<script>` before `<body>`: reads/sets `localStorage` and `document.documentElement.dataset.scheme` synchronously to prevent FOUT |
| `style.html` | Compiles `scss/style.scss` via Hugo SCSS pipeline, minifies, fingerprints |
| `preconnect.html` | `<link rel="preconnect">` for jsDelivr, Google Fonts |
| `custom-font.html` | Loads Poppins (300/400/700) from Google Fonts |
| `custom.html` | Empty — user extension point for custom `<head>` HTML |
| `opengraph/include.html` | Calls `base.html` and `twitter.html` OG providers |
| `opengraph/provider/base.html` | Standard OG meta tags (title, description, url, image, article times, etc.) |
| `opengraph/provider/twitter.html` | Twitter card meta tags |

### `helper/`

**Return partials** — always call with `partial "helper/..." .` and capture the return value.

| File | Returns / Purpose |
|---|---|
| `image.html` | Returns `{Local, Resource, ColorResource, Permalink, Height, Width}`. Handles local images (via `.Resources.Get`), remote images (via `resources.GetRemote`), and SVGs. Resizes to max 2048px, converts to WebP, strips EXIF. `ColorResource` is always the original for palette extraction. |
| `color-from-str.html` | Returns `{BackgroundColor, TextColor, Hue}` — deterministic HSL colors from an FNV32a hash of the input string. Used for category pill colors. |
| `pages.html` | Returns the page collection for the current context (home → mainSections; section/taxonomy → filtered regular pages). Pipes through `pages-sort.html`. |
| `pages-sort.html` | Sorts by `Lastmod.Reverse` when `SortBy == "lastmod"`, otherwise default order. |
| `paginator.html` | Calls `.Paginate` on `helper/pages.html` result. Returns empty for non-list page kinds. |
| `icon.html` | Inlines `assets/icons/<name>.svg`. Build-time error if icon not found. |
| `external.html` | Emits `<script>` or `<link>` tags from `site.Data.external.<Namespace>`. Used by `components/math.html` for KaTeX. |

### `pagination.html`

Pagination nav. Only rendered when `TotalPages > 1`. Renders: `[←] [1] [...] [start…end] [...] [N] [→]`.

Window algorithm (always 3 middle pages when total > 5):
- Default: `start = curr-1`, `end = curr+1`
- Near start (`start <= 1`): pin to `[2, 4]`
- Near end (`end >= total`): pin to `[total-3, total-1]`
- Total ≤ 5: show all middle pages `[2, total-1]`, no ellipsis

Pages whose distance from current is > 1 get `.hide-on-mobile` (hidden below `md` breakpoint).

### `sidebar/`

| File | Purpose |
|---|---|
| `left.html` | Sticky left sidebar: hamburger toggle, avatar, site name/description, social links, main nav (with active-state detection), language switcher, dark mode toggle |
| `right.html` | Iterates `site.Params.widgets.<scope>` (`"homepage"` or `"page"`), renders each widget via `partial "widget/<type>"` |

### `widget/`

| File | Purpose |
|---|---|
| `archives.html` | Finds the archives page, groups site pages by year, shows up to `limit` (default 5) years with post counts |
| `categories.html` | Thin wrapper → delegates to `widget/taxonomy` with `taxonomy: "categories"` |
| `tag-cloud.html` | Thin wrapper → delegates to `widget/taxonomy` with `taxonomy: "tags"` |
| `taxonomy.html` | Generic taxonomy widget: top `limit` (default 10) terms by count as tag-pill links |
| `search.html` | Finds the search page by `layout: search`, renders a search form pointing to it |
| `toc.html` | Shown only when `.Context.Scratch.Get "TOCEnabled"` is true (set by `single.html`). Renders TOC via `article/components/toc` |

---

## Shortcodes (`_shortcodes/`)

| File | Usage |
|---|---|
| `bilibili.html` | `{{< bilibili BV1xx411c7mD >}}` — embeds Bilibili video (AV or BV number, optional part) |
| `tencent.html` | `{{< tencent vid >}}` — embeds Tencent Video player |
| `youtube.html` | `{{< youtube id >}}` — embeds YouTube; respects Hugo Privacy.YouTube config; supports `autoplay` param |
| `video.html` | `{{< video src="..." poster="..." autoplay=true muted=true >}}` — native HTML5 `<video>` |
| `gitlab.html` | `{{< gitlab snippetId >}}` — embeds GitLab snippet via CDN script tag |
| `quote.html` | `{{< quote author="..." source="..." url="..." >}}...{{< /quote >}}` — styled blockquote |

All video embeds use `.video-wrapper` for 16:9 responsive sizing.

---

## Adding New Features

- **New page type:** Create a top-level template (e.g., `layouts/mytype.html`) filling the `main`/`right-sidebar`/`body-class` blocks.
- **New widget:** Add `layouts/_partials/widget/mywidget.html`; enable it in site config under `params.widgets.homepage` or `params.widgets.page`.
- **New comment provider:** Add `layouts/_partials/comments/provider/myprovider.html`; read config from `site.Params.comments`.
- **New shortcode:** Add `layouts/_shortcodes/myshortcode.html`.
- **i18n strings:** When adding UI text, add keys to all locale files in `i18n/` (minimum `en.toml`).
