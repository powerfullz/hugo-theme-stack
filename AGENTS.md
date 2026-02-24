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
