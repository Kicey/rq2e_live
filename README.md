# React Quickly Live

An interactive, browser-only tutorial companion for all 91 examples from the
[`rq2e/rq2e`](https://github.com/rq2e/rq2e) repository. Those examples
accompany *React Quickly, Second Edition* by Morten Barklund and Azat Mardan,
published by Manning Publications, and are included here through the `rq2e`
Git submodule.

Every section uses the same resizable three-pane workspace:

- a sandboxed React preview;
- a multi-file explorer and CodeMirror editor powered by Sandpack;
- scrollable Markdown lesson content.

## Architecture

The tutorial shell is a React and TypeScript application built by Vite. Sandpack owns the editable virtual filesystem, compiles the selected example in the browser, and runs it in an isolated iframe. The source examples remain in the `rq2e` Git submodule; no source is duplicated in the tutorial application.

The content registry discovers chapter and example folders at build time. Source files are emitted as lazy chunks and fetched only when their section is opened. A shared chapter profile supplies the learning context and experiment guidance, while a section can override that generated lesson with authored Markdown when it needs more detail. Public SVG and PNG assets are embedded into the selected sandbox so the previews remain compatible with static GitHub Pages hosting.

No production backend is required. Node.js is used only for local development, tests, and the static GitHub Pages build.

## Run locally

Initialize the submodule, install dependencies, and start Vite:

```sh
git submodule update --init --recursive
npm install
npm run dev
```

Open `http://localhost:4173/` to start with Chapter 1's first section.

## Verification

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e
```

The Playwright suite verifies the catalog, standalone HTML, embedded PNG/SVG assets, insecure LAN origins, and the complete add-task interaction through the Sandpack preview.

## Add another section

1. Add the example folder to the matching `rq2e/chXX` directory in the submodule.
2. If it follows the existing `src`/`public` structure, the catalog discovers it automatically.
3. Add an entry to `sectionOverrides` in `src/content/chapters.ts` only when it needs custom metadata.
4. Import an authored Markdown lesson and select it in `loadSection` only when the generated chapter lesson is not sufficient.

The source globs require examples to be one directory below their chapter. This keeps accidental files such as nested `node_modules` out of the tutorial build.

## Deploy

The Pages workflow checks out the submodule, installs dependencies, builds `dist/`, and deploys it whenever `main` is pushed. In the repository, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** once.

## License

The original React Quickly Live tutorial shell is available under the
[MIT License](LICENSE). The upstream examples and content in the `rq2e/`
submodule are excluded from that license; see
[Third-party notices](THIRD_PARTY_NOTICES.md) for attribution and licensing
details.
