# 🤖 Agent Operating Guidelines (AGENTS.md)

Welcome, AI coding agent. This document serves as your guide to operating effectively within the `hugo-theme-stack` repository. Please read carefully before writing or modifying any code.

## 📌 1. Project Overview & Architecture
This is a popular, feature-rich Hugo theme designed to be fast, responsive, and visually appealing.
- **Tech Stack:** Vanilla TypeScript, SCSS (Dart Sass), and Hugo Go Templates.
- **No Node.js/NPM Dependency:** There is **no** `package.json`, `npm install`, or Node-based build tooling (e.g., Webpack, Vite). All compilation (TypeScript to JS, SCSS to CSS, minification, fingerprinting) is natively handled by **Hugo Pipes** (Hugo Extended version >= 0.157.0 is required). Do not attempt to run `npm install` or use Node modules.
- **Testing/Linting:** There are no automated test suites (Jest/Vitest) or strict linters (ESLint/Prettier). All testing is done by manually building the `demo` site and verifying output.

### Key Directories
- `assets/ts/`: All TypeScript code. Includes `.tsx` files utilizing a custom minimal JSX factory (no React).
- `assets/scss/`: All SCSS stylesheets.
- `layouts/`: All Hugo Go HTML templates.
- `demo/`: A sample Hugo site used for local development and manual testing.

---

## 🚀 2. Build & Test Commands

**1. Start the Development Server (Local Testing)**
To see your changes live with Hot Module Replacement (HMR), navigate to the demo directory and run the shell script.
```bash
cd demo
./run.sh
# This executes: hugo server --gc --themesDir=../..
```

**2. Production Build (Sanity Check)**
To ensure no compilation errors exist, run a production build:
```bash
cd demo
hugo --gc --minify --themesDir=../..
```

**3. Build with the Production Blog (Recommended)**
A real production blog lives at `../blog/` (i.e., `/home/powerfullz/repos/blog`). It uses Hugo Modules to import the theme via `github.com/powerfullz/hugo-theme-stack/v2`. To build or serve the blog using your **local, in-development** theme source, temporarily add a `replace` rule in the blog's `go.mod`, then remove it after verification:

```bash
# Add temporary local replacement
cd ../blog
go mod edit -replace=github.com/powerfullz/hugo-theme-stack/v2=../hugo-theme-stack

# Development server with the production blog
hugo server --gc

# Production build with the production blog
hugo --gc --minify

# Remove temporary replacement when done
go mod edit -dropreplace=github.com/powerfullz/hugo-theme-stack/v2
```

This is the **preferred** way to verify theme changes because it exercises the theme against real-world content, configurations (multilingual, CJK, Git info, pagination, etc.), and custom layouts that the minimal `demo` site may not cover.

**4. Build with the Demo Site (Fallback)**
The `demo/` directory contains a minimal sample site for quick iteration:
```bash
cd demo
./run.sh
# This executes: hugo server --gc --themesDir=../..
```
Production build:
```bash
cd demo
hugo --gc --minify --themesDir=../..
```

**5. Running a "Test"**
Because there are no unit tests, "running a test" means successfully starting the Hugo dev server and verifying there are no syntax errors in the Go templates, SCSS compilation failures, or TypeScript build errors logged to the console.

---

## 💅 3. Code Style Guidelines

### TypeScript / JavaScript
- **File Extensions:** Use `.ts` for standard scripts and `.tsx` for DOM generation using the custom JSX factory.
- **Custom JSX:** The project uses a custom `createElement` function for JSX rendering (found in `assets/ts/createElement.ts`), **not React**.
  - Do NOT `import React from 'react'`.
  - Look at `assets/ts/search.tsx` for an example of how JSX is structured and rendered.
- **Formatting:** Use 4 spaces for indentation. Use single quotes (`'...'`) unless using template literals.
- **Types:** Always use explicit types (`string`, `number`, `HTMLElement`, `Event`). Define `interface` for data structures.
- **DOM Safety:** Always check if elements exist before attaching event listeners or mutating them (e.g., `const el = document.querySelector('.element'); if (!el) return;`).
- **Error Handling:** Use `try...catch` blocks for asynchronous network operations. Fail gracefully instead of crashing the client-side logic.

### SCSS
- **Structure:** Modularize styles inside `assets/scss/partials/`. Do not bloat `style.scss`.
- **Variables & Theming:** The theme fully supports Light and Dark modes.
  - NEVER hardcode hex colors. Always map new styles to CSS variables defined in `assets/scss/variables.scss` (e.g., `var(--card-background)`).
- **Indentation:** Use 4 spaces.
- **Media Queries:** Use predefined breakpoints from `assets/scss/breakpoints.scss`.

### Hugo Templates (Go Templates)
- **Whitespace Control:** Liberally use `{{-` and `-}}` to strip unnecessary whitespace from the final HTML output.
- **Pipes for Assets:** Rely on `resources.Get` and `js.Build` / `toCSS` for asset processing. Look at `layouts/_partials/head/style.html` for examples.
- **Context Passing:** Be cautious with `.` (dot) context. When calling partials, explicitly pass required data (e.g., `{{ partial "article.html" . }}`).

---

## 🛑 4. Rules of Engagement for Agents

1. **Do not assume a Node environment.** Do not try to run `npx`, `npm run build`, or `yarn`. Everything relies on `hugo`.
2. **Always test compilation.** Before concluding a task, you MUST run the production blog build with a temporary `go.mod` replace rule (for example: `cd ../blog && go mod edit -replace=github.com/powerfullz/hugo-theme-stack/v2=../hugo-theme-stack && hugo --gc --minify && go mod edit -dropreplace=github.com/powerfullz/hugo-theme-stack/v2`) to guarantee your changes do not break the Hugo build pipeline. If the production blog is unavailable, fall back to the demo site build (`cd demo && hugo --gc --minify --themesDir=../..`). Pay special attention to Go template syntax errors or missing SCSS variables.
3. **UI Testing with Playwright MCP.** When verifying layout, CSS, or interactive features, you should use the Playwright MCP. First, start a local development server (`./run.sh` in the `demo` directory or the blog directory) in the background. Then, use the Playwright MCP tools to navigate to `http://localhost:1313`, interact with the page, take snapshots, and verify visual correctness. **Crucially**, when you are finished testing, make sure to kill the running Hugo process so it doesn't run indefinitely in the background.
   - **DO NOT use** `pkill -f "hugo server"` — the `-f` flag matches the full command line and can match grep itself or shell pipeline processes, causing hangs.
   - **DO NOT use** `pgrep -f "hugo" | xargs kill -9` — if `pgrep` returns no results, `xargs kill -9` waits on stdin and hangs.
   - **Use one of these safe methods:**
     ```bash
     # Method 1: Exact process name match (recommended)
     pkill -x hugo 2>/dev/null

     # Method 2: Kill by PID (if you recorded it when starting)
     kill <PID> 2>/dev/null

     # Method 3: Subshell with null guard
     kill $(pgrep -f "hugo server") 2>/dev/null
     ```
4. **Respect existing conventions.** Mimic the surrounding code's styling. Do not introduce large third-party libraries unless explicitly instructed to do so. Keep the theme lightweight.
5. **Target the correct file.** If fixing a styling issue, look in `assets/scss/`. If fixing a layout structure, look in `layouts/`. If modifying client-side behavior, edit `assets/ts/`.
6. **Adjacent Upstream Repository:** You may be asked to backport or submit commits to the upstream repository located at `../hugo-theme-stack-upstream`. **DO NOT** submit, push, or modify the adjacent repository unless explicitly instructed to do so by the user. If instructed, you can transfer commits using `git format-patch` and `git am`.
   ```bash
   # Example workflow for backporting a commit:
   git format-patch -1 <commit-hash> --stdout > /tmp/patch.patch
   cd ../hugo-theme-stack-upstream
   git checkout <target-branch>
   git am /tmp/patch.patch
   git push origin <target-branch>
   ```
