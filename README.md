# React Quickly Live

An interactive, browser-only tutorial companion for the examples in the `rq2e` submodule. The current archetype presents Chapter 13's `rq13-steps` project in a resizable three-pane workspace:

- a sandboxed React preview;
- a multi-file explorer and CodeMirror editor powered by Sandpack;
- scrollable Markdown lesson content.

## Architecture

The tutorial shell is a React and TypeScript application built by Vite. Sandpack owns the editable virtual filesystem, compiles the selected example in the browser, and runs it in an isolated iframe. The source examples remain in the `rq2e` Git submodule and are imported as raw files during the Vite build; no source is duplicated in the tutorial application.

Lesson metadata is defined in `src/content`. Each section declares its route, entry file, initially selected file, dependencies, source URL, and Markdown lesson. The UI consumes the shared `TutorialSection` type, allowing additional chapters to use the same preview, explorer, editor, and lesson components.

No production backend is required. Node.js is used only for local development, tests, and the static GitHub Pages build.

## Run locally

Initialize the submodule, install dependencies, and start Vite:

```sh
git submodule update --init --recursive
npm install
npm run dev
```

Open `http://localhost:4173/#/chapter/13/rq13-steps`.

## Verification

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e
```

The Playwright test verifies the complete browser path by adding a task through the Sandpack preview.

## Add another section

1. Add a typed section module and Markdown lesson under `src/content/chXX`.
2. Import the required example files with a narrow `import.meta.glob` expression.
3. Register the section in `src/content/chapters.ts`.

Keeping each glob narrow ensures the production bundle contains only examples that are actually part of the tutorial.

## Deploy

The Pages workflow checks out the submodule, installs dependencies, builds `dist/`, and deploys it whenever `main` is pushed. In the repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** once.
