# assets/ — Frontend Source

## Directory Structure

```
assets/
├── scss/
│   ├── style.scss               # Entry point — imports everything in order
│   ├── breakpoints.scss         # respond() mixin and $breakpoints map
│   ├── variables.scss           # CSS custom properties, SCSS vars, dark-mode overrides
│   ├── grid.scss                # Container, layout, flex utilities
│   ├── general.scss             # Link styles, section titles, dark-mode image filter
│   ├── custom.scss              # User extension point (empty, imported last)
│   ├── external/
│   │   └── normalize.scss       # Standard CSS normalize/reset
│   ├── partials/
│   │   ├── base.scss            # html/body reset, scrollbar
│   │   ├── menu.scss            # Hamburger, main-menu, social-menu
│   │   ├── article.scss         # Article list card variants + Mermaid UI
│   │   ├── sidebar.scss         # Left/right sidebar, dark-mode toggle, i18n select
│   │   ├── widgets.scss         # .widget base, tag cloud pills, archives widget list
│   │   ├── footer.scss          # Site footer
│   │   ├── pagination.scss      # Pagination bar
│   │   ├── cookies.scss         # Cookie consent banner and settings panel
│   │   ├── highlight/
│   │   │   ├── common.scss      # Chroma token classes (color vars defined by light/dark)
│   │   │   ├── light.scss       # Sets highlight color vars, @imports common.scss
│   │   │   └── dark.scss        # Sets highlight color vars, @imports common.scss
│   │   └── layout/
│   │       ├── article.scss     # .article-page: prose content, TOC, gallery, alerts
│   │       ├── list.scss        # .section-card, .subsection-list
│   │       ├── 404.scss         # .not-found-card
│   │       └── search.scss      # .search-form
│   └── custom/
│       ├── _common.scss         # Shared overrides: compact cards, scrollbar, TOC padding
│       └── themes/
│           ├── neon/            # Dark-mode neon/purple theme
│           │   ├── background.scss
│           │   ├── cards.scss
│           │   ├── widgets.scss
│           │   └── pagination.scss
│           └── cyberpunk/       # Light-mode cyberpunk 2077 theme
│               ├── background.scss
│               ├── cards.scss
│               ├── widgets.scss
│               ├── search.scss
│               └── pagination.scss
├── ts/
│   ├── main.ts                  # Entry point loaded deferred from footer
│   ├── colorScheme.ts           # Dark/light toggle, localStorage persistence
│   ├── menu.ts                  # Hamburger slide animation
│   ├── scrollspy.ts             # TOC active-state tracking
│   ├── smoothAnchors.ts         # Intercepts # clicks, smooth-scrolls to target
│   ├── gallery.ts               # Wraps gallery-image imgs in <figure>, initializes PhotoSwipe
│   ├── search.tsx               # Client-side search (JSX, no React)
│   ├── mermaid.ts               # Mermaid rendering + dark/light theme switching
│   ├── cookies.ts               # Cookie consent banner logic
│   └── createElement.ts         # Minimal JSX factory (used by search.tsx)
└── icons/                       # SVG icons inlined via helper/icon.html
```

---

## SCSS Import Order (`style.scss`)

Order matters — later imports win on specificity ties:

1. `breakpoints.scss`
2. `variables.scss`
3. `grid.scss`
4. `external/normalize.scss`
5. `partials/menu.scss`
6. `partials/article.scss`
7. `partials/widgets.scss`
8. `partials/footer.scss`
9. `partials/pagination.scss`
10. `partials/sidebar.scss`
11. `partials/base.scss`
12. `partials/layout/article.scss`
13. `partials/layout/list.scss`
14. `partials/layout/404.scss`
15. `partials/layout/search.scss`
16. `partials/cookies.scss`
17. `general.scss`
18. `custom.scss` ← **last; overrides everything above**

Notice that custom.scss is EMPTY, and we did not import anything in `custom/` at all, this folder is preserved only for archiving purpose! When adding new component styles, add a new `partials/*.scss` and import it before `general.scss`.

---

## Key SCSS Files

### `breakpoints.scss`

Defines the `$breakpoints` map and the `respond($bp)` mixin:

```scss
@include respond(md) { ... }  // min-width: 768px
```

Breakpoints: `sm` 640 / `md` 768 / `lg` 1024 / `xl` 1280 / `2xl` 1536 (px).

### `variables.scss`

All CSS custom properties (`--*`) on `:root`, plus SCSS vars used by custom themes.

Groups:

- `$neon-*` SCSS variables (referenced by neon theme and `mermaid.ts`)
- Layout: `--main-top-padding`, `--section-separation`, `--container-padding`
- Colors: `--body-background`, `--accent-color`, `--accent-color-darker`, `--accent-color-text`
- Card: `--card-background`, `--card-background-selected`, `--card-border-radius`, `--card-padding`, text-color tiers (main/secondary/tertiary)
- Typography: `--base-font-family`, `--code-font-family`, `--article-font-*`, `--article-line-height`
- Content: blockquote, alert colors (note/tip/important/warning/caution), code block vars, table vars
- Shadows: `--shadow-l1` through `--shadow-l4`
- Dark-mode overrides in `[data-scheme="dark"]` blocks
- Highlight vars scoped to `[data-scheme="light"]` and `[data-scheme="dark"]` via `@import` of `partials/highlight/light.scss` / `dark.scss`

### `grid.scss`

Container responsive max-widths, sidebar percentage widths. `.extended` (has right sidebar) vs `.compact` (no right sidebar). `main.main` flex-grow rules.

### `partials/base.scss`

`html { font-size: 62.5% }` — makes `1rem = 10px`, so `1.6rem = 16px`. `box-sizing: border-box`. Body background/font. Scrollbar styles for Firefox and Chromium.

### `partials/article.scss`

Three article list card variants:

| Class                    | Layout                                                                                        | Notes                             |
| ------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------- |
| `.article-list`          | Vertical card stack with responsive top image (150/200/250px at sm/md/lg)                     | Default homepage/section          |
| `.article-list--compact` | Horizontal row: small thumbnail left, title + date right, all items share one card background | Archives, search results, widgets |
| `.article-list--tile`    | Fixed 250×350px tiles, `position: absolute` image fill                                        | Related content, subsections      |

Also contains Mermaid UI styles: spinner placeholder, diagram wrapper, toolbar, fullscreen modal, panzoom container.

### `partials/layout/article.scss`

Full prose content styles inside `.article-page`:

- `.article-header` featured image (max 50vh)
- `.article-content`: headings with left accent border + `#` anchor, blockquotes, five alert types, inline code, `.highlight` code blocks + copy button, `.table-wrapper` horizontal scroll, `.gallery` flexbox layout, `.video-wrapper` 16:9 aspect ratio
- TOC: `.toc-nav` scrollable with counter-based `<ol>` numbering, `.active-class` indicator, indented via negative margin
- Inline `<details>` TOC (`.article-toc`): hidden on `lg+` breakpoint
- Related content strip

### `partials/layout/list.scss`

`.section-card` — taxonomy/section header card (title, count, description, image). `.subsection-list` — horizontally scrollable tile strip for subsections.

### `partials/pagination.scss`

`.pagination` flex bar. Each `.page-link` is `flex: 1 1 auto`. Prev/next chevrons: `flex: 0 0 40px`. `.current` gets selected background. `.disabled` reduced opacity + `pointer-events: none`. `.hide-on-mobile` hidden below `md` breakpoint.

### `partials/highlight/`

`light.scss` and `dark.scss` each set SCSS color variables then `@import "common.scss"`. `common.scss` maps those variables to Chroma token classes. Both are `@import`-ed inline inside `variables.scss` (scoped to `[data-scheme="light"]` and `[data-scheme="dark"]`).

### `custom/_common.scss`

Fork-specific overrides always active:

- `.article-list--compact` articles as individual cards (no shared background, 15px bottom margin)
- `.widget--toc` 10px top/bottom padding
- Custom scrollbar: 8px width, accent-color thumb, accent-color-darker on hover

### `custom/themes/neon/` and `custom/themes/cyberpunk/`

Parallel structures. Neon targets `[data-scheme="dark"]`, cyberpunk targets `[data-scheme="light"]`. Each has:

- `background.scss` — body background pattern
- `cards.scss` — card borders, shadows, glow effects (uses `card-targets` mixin from `_common.scss`)
- `widgets.scss` — widget overrides
- `pagination.scss` — pagination overrides

Both are imported via `custom.scss` → `custom/_index.scss` (last in the cascade, so they override everything).

---

## TypeScript Files (`ts/`)

### `main.ts` — Entry point

Loaded deferred. On `window.load`: hamburger menu, smooth anchors + scrollspy (when `.article-content` exists), copy-to-clipboard buttons on `.highlight` blocks, `StackColorScheme` on `#dark-mode-toggle`. Exposes `window.Stack` and `window.createElement` globals.

### `colorScheme.ts` — `StackColorScheme` class

Persists scheme to `localStorage` key `StackColorScheme`. Toggle: dark → light → dark. If new explicit scheme matches system preference, downgrades to `'auto'`. Responds to `prefers-color-scheme` media query changes. Dispatches `onColorSchemeChange` custom event (consumed by `mermaid.ts`). Sets `document.documentElement.dataset.scheme`.

### `menu.ts`

Hamburger toggle with `slideUp`/`slideDown` height + margin + padding transitions (300ms). Guards against re-triggering while animating via `.transiting` check.

### `scrollspy.ts`

TOC scrollspy. Queries all `h1`–`h6[id]` in `.article-content`. On scroll (debounced via `requestAnimationFrame`): finds the deepest heading above scroll position (20px offset), adds `active-class` to its TOC `<li>`, auto-scrolls the TOC to center it — but not when the mouse is over the TOC. `ResizeObserver` on `.article-content` recomputes offsets on reflow.

### `smoothAnchors.ts`

Intercepts clicks on all `a[href^="#"]`. Calculates target offset, calls `window.scrollTo({ behavior: "smooth" })`, pushes anchor to history. Workaround for Chromium bug where two simultaneous smooth scrolls conflict.

### `gallery.ts`

Wraps `img.gallery-image` elements (inside paragraphs with no text) in `<figure class="gallery-image">` elements. Uses `data-flex-grow`/`data-flex-basis` from render hook for aspect-ratio-based CSS flexbox gallery layout. Adds `<figcaption>` from Markdown image title. Creates PhotoSwipe-compatible `<a>` wrappers with `data-pswp-width/height`. Groups adjacent figures into `.gallery` containers. Imported by `photoswipe.html`.

### `search.tsx`

Client-side full-text search. JSX compiled with `createElement.ts` as factory (no React). Fetches JSON index from `form[data-json]`. Multi-keyword regex search across title and content. Produces highlighted snippets with `<mark>`. Sorts results by match count descending. Updates `?keyword=` in URL bar. Handles browser back/forward. Used on search page and 404 page.

### `mermaid.ts` — `initMermaidPage(config)`

1. Collects `.mermaid` elements; extracts raw source HTML
2. `setupWrappers`: adds "Expand" toolbar button per diagram
3. `setupModal`: wires fullscreen modal with panzoom (loaded on-demand from CDN)
4. Renders diagrams for current scheme via `mermaid.run({ nodes })`
5. Caches rendered SVG HTML per scheme
6. Pre-renders alternate scheme into off-screen container during idle time
7. On `onColorSchemeChange`: swaps cached SVG instantly (or renders if uncached)

`%%transparent%%` comment in a diagram forces transparent SVG background. Default dark theme colors use `$neon-*` SCSS variables.

### `cookies.ts` — `CookieConsent` class

Persists consent as JSON in `cookie_consent` cookie (365-day expiry). Shows banner on first visit. Handles Accept All / Deny All / Save Preferences. Dispatches `onCookieConsentChange` event (consumed by `cookies/analytics.html`). Sets `document.documentElement.dataset.consentAnalytics/Functional`. Exposes `window.cookieConsent.hasConsent(category)` and `window.cookieConsent.getState()`.

### `createElement.ts`

Minimal JSX factory. Handles `dangerouslySetInnerHTML`, boolean attributes, child appending. Used as `jsxFactory` when compiling `search.tsx`.

---

## Icons (`icons/`)

24 SVG files from Tabler Icons, inlined by `layouts/_partials/helper/icon.html`:

`archives`, `arrow-back`, `back`, `brand-github`, `brand-twitter`, `categories`, `chevron-left`, `chevron-right`, `clock`, `copyright`, `date`, `dots`, `hash`, `home`, `infinity`, `language`, `link`, `messages`, `rss`, `search`, `tag`, `toggle-left`, `toggle-right`, `user`

To add a new icon: drop an SVG into `assets/icons/<name>.svg`, then call `{{ partial "helper/icon" (dict "class" "icon" "name" "<name>") }}` in a template.

---

## Adding New Styles

- **New component:** Add `assets/scss/partials/mycomponent.scss`, import it in `style.scss` before `general.scss`.
- **Theme override:** Add rules to `assets/scss/custom/themes/neon/` or `cyberpunk/`; use the `card-targets` mixin from `_common.scss` to target all card elements at once.
- **User extension:** `assets/scss/custom.scss` is the designated override file — it is imported last so anything here wins.

## Adding New TypeScript

- **New module loaded on every page:** Import and call from `main.ts`.
- **Lazy-loaded module (e.g., for a specific feature):** Load as an ES module from the relevant partial (see `mermaid.html` and `gallery.ts` as examples).
- **User extension:** Place `ts/custom.ts` in the site's own `assets/ts/` — `footer/components/script.html` will pick it up automatically.
