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

**3. Running a "Test"**
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
2. **Always test compilation.** Before concluding a task, you MUST run `cd demo && hugo --gc --minify --themesDir=../..` to guarantee your changes do not break the Hugo build pipeline. Pay special attention to Go template syntax errors or missing SCSS variables.
3. **Respect existing conventions.** Mimic the surrounding code's styling. Do not introduce large third-party libraries unless explicitly instructed to do so. Keep the theme lightweight.
4. **Target the correct file.** If fixing a styling issue, look in `assets/scss/`. If fixing a layout structure, look in `layouts/`. If modifying client-side behavior, edit `assets/ts/`.
