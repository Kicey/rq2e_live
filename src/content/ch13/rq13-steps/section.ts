import lesson from "./lesson.md?raw";
import type { TutorialFile, TutorialSection } from "../../types";

const sourcePrefix = "/rq2e/ch13/rq13-steps/";

const sourceModules = import.meta.glob(
  "/rq2e/ch13/rq13-steps/src/**/*.{js,css}",
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;

const publicModules = import.meta.glob(
  "/rq2e/ch13/rq13-steps/public/**/*.{html,svg}",
  { eager: true, query: "?raw", import: "default" },
) as Record<string, string>;

function toSandpackPath(sourcePath: string): string {
  return `/${sourcePath.slice(sourcePrefix.length)}`;
}

function collectFiles(): Record<string, TutorialFile> {
  const files: Record<string, TutorialFile> = Object.fromEntries(
    Object.entries({ ...sourceModules, ...publicModules }).map(([path, code]) => [
      toSandpackPath(path),
      { code },
    ]),
  );

  return files;
}

const files = collectFiles();
const previewAssetStyles = Object.entries(publicModules)
  .filter(([path]) => path.includes("/public/icons/"))
  .map(([path, source]) => {
    const filename = path.slice(path.lastIndexOf("/") + 1);
    const dataUrl = `data:image/svg+xml,${encodeURIComponent(source)}`;
    return `img[src$="icons/${filename}"] { content: url("${dataUrl}"); }`;
  })
  .join("\n");
// Sandpack identifies stylesheets by their URL suffix. The fragment keeps this
// self-contained data URL classified as CSS without becoming part of its data.
const previewAssetStylesheet = `data:text/css;charset=utf-8,${encodeURIComponent(previewAssetStyles)}#.css`;
const visibleFiles = Object.keys(files)
  .filter((path) => path.startsWith("/src/"))
  .sort((left, right) => left.localeCompare(right));

export const rq13Steps: TutorialSection = {
  chapter: 13,
  slug: "rq13-steps",
  title: "Adding steps to the task manager",
  heading: "Sharing state across a component tree",
  summary:
    "Build a task manager whose tasks and steps stay synchronized while the interface is split into small, focused components.",
  sourceUrl: "https://github.com/rq2e/rq2e/tree/main/ch13/rq13-steps",
  entryFile: "/src/index.js",
  initialFile: "/src/App.js",
  visibleFiles,
  files,
  dependencies: {
    react: "18.2.0",
    "react-dom": "18.2.0",
  },
  externalResources: [previewAssetStylesheet],
  lesson,
};
