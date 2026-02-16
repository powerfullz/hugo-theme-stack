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

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit prefixes such as `feat:`, `fix:`, and `chore:`. Continue this format and keep each commit focused.

PRs should include:
- A clear summary of user-visible and technical changes.
- Linked issue(s) when applicable.
- Screenshots/GIFs for UI or layout updates.
- Confirmation that local Hugo build and formatting checks passed.
