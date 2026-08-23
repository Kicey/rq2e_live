import rq13StepsLesson from "./ch13/rq13-steps/lesson.md?raw";
import { buildLesson, chapterProfiles } from "./chapterProfiles";
import type {
  TutorialChapter,
  TutorialFile,
  TutorialSection,
  TutorialSectionMeta,
} from "./types";

type TextLoader = () => Promise<string>;

const sourceLoaders = import.meta.glob<string>(
  "/rq2e/ch*/*/src/**/*.{js,css,json}",
  { query: "?raw", import: "default" },
) as Record<string, TextLoader>;

const publicTextLoaders = import.meta.glob<string>(
  "/rq2e/ch*/*/public/**/*.{html,svg,json,txt}",
  { query: "?raw", import: "default" },
) as Record<string, TextLoader>;

const publicImageLoaders = import.meta.glob<string>(
  "/rq2e/ch*/*/public/**/*.{png,jpg,jpeg,gif,webp}",
  { query: "?inline", import: "default" },
) as Record<string, TextLoader>;

const standaloneLoaders = import.meta.glob<string>(
  "/rq2e/ch*/*/index.html",
  { query: "?raw", import: "default" },
) as Record<string, TextLoader>;

const sectionPathPattern = /^\/rq2e\/ch(\d+)\/([^/]+)\//;
const reactDependencies = { react: "18.2.0", "react-dom": "18.2.0" };
const networkSections = new Set([
  "6/rq06-remote-dropdown",
  "8/rq08-video-player",
  "10/rq10-reducer-load",
]);
const helloWorldAdapter = `import React from "react";
import { createRoot } from "react-dom/client";

const reactElement = React.createElement("h1", null, "Hello world!!!");
const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(reactElement);`;

const sectionOverrides: Record<string, Partial<TutorialSectionMeta>> = {
  "13/rq13-steps": {
    title: "Adding steps to the task manager",
    heading: "Sharing state across a component tree",
    summary:
      "Build a task manager whose tasks and steps stay synchronized while the interface is split into small, focused components.",
  },
};

function parseSectionPath(path: string) {
  const match = path.match(sectionPathPattern);
  if (!match) throw new Error(`Invalid tutorial source path: ${path}`);
  return { chapter: Number(match[1]), slug: match[2] };
}

function sectionKey(chapter: number, slug: string): string {
  return `${chapter}/${slug}`;
}

function humanizeSlug(slug: string): string {
  const words = slug
    .replace(/^rq\d+-/, "")
    .replace(/-v(\d+)$/, " version $1")
    .replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function createMeta(chapter: number, slug: string): TutorialSectionMeta {
  const profile = chapterProfiles[chapter];
  const isStandalone = chapter === 1;
  const title = humanizeSlug(slug);
  const paddedChapter = String(chapter).padStart(2, "0");
  const key = sectionKey(chapter, slug);
  const base: TutorialSectionMeta = {
    chapter,
    chapterTitle: profile.title,
    slug,
    title,
    heading: `${profile.heading}: ${title}`,
    summary: profile.summary,
    sourcePath: `rq2e/ch${paddedChapter}/${slug}`,
    sourceUrl: `https://github.com/rq2e/rq2e/tree/main/ch${paddedChapter}/${slug}`,
    template: "react",
    runtime: isStandalone ? "adapted" : networkSections.has(key) ? "network" : "direct",
    entryFile: "/src/index.js",
    initialFile: isStandalone ? "/index.html" : "/src/App.js",
    dependencies: reactDependencies,
  };

  return { ...base, ...sectionOverrides[key] };
}

function discoverSections(): TutorialSectionMeta[] {
  const paths = [...Object.keys(sourceLoaders), ...Object.keys(standaloneLoaders)];
  const discovered = new Map<string, TutorialSectionMeta>();

  for (const path of paths) {
    const { chapter, slug } = parseSectionPath(path);
    const key = sectionKey(chapter, slug);
    if (!discovered.has(key)) discovered.set(key, createMeta(chapter, slug));
  }

  return [...discovered.values()].sort(
    (left, right) => left.chapter - right.chapter || left.slug.localeCompare(right.slug),
  );
}

export const sections: TutorialSectionMeta[] = discoverSections();

export const chapters: TutorialChapter[] = Object.values(
  sections.reduce<Record<number, TutorialChapter>>((result, section) => {
    result[section.chapter] ??= {
      number: section.chapter,
      title: section.chapterTitle,
      sections: [],
    };
    result[section.chapter].sections.push(section);
    return result;
  }, {}),
).sort((left, right) => left.number - right.number);

export function getSection(
  chapter: string,
  slug: string,
): TutorialSectionMeta | undefined {
  return sections.find(
    (section) => String(section.chapter) === chapter && section.slug === slug,
  );
}

function loadersFor(
  loaders: Record<string, TextLoader>,
  sourcePrefix: string,
): Array<[string, TextLoader]> {
  return Object.entries(loaders).filter(([path]) => path.startsWith(sourcePrefix));
}

function toSandpackPath(path: string, sourcePrefix: string): string {
  return `/${path.slice(sourcePrefix.length)}`;
}

function assetStylesheet(
  svgAssets: ReadonlyArray<readonly [string, string]>,
  imageAssets: ReadonlyArray<readonly [string, string]>,
  publicPrefix: string,
): string | undefined {
  const rules = [
    ...svgAssets.map(([path, source]) => {
      const relativePath = path.slice(publicPrefix.length);
      const dataUrl = `data:image/svg+xml,${encodeURIComponent(source)}`;
      return `img[src$="${relativePath}"] { content: url("${dataUrl}"); }`;
    }),
    ...imageAssets.map(([path, dataUrl]) => {
      const relativePath = path.slice(publicPrefix.length);
      return `img[src$="${relativePath}"] { content: url("${dataUrl}"); }`;
    }),
  ];

  if (rules.length === 0) return undefined;
  const css = rules.join("\n");
  return `data:text/css;charset=utf-8,${encodeURIComponent(css)}#.css`;
}

export async function loadSection(meta: TutorialSectionMeta): Promise<TutorialSection> {
  const sourcePrefix = `/${meta.sourcePath}/`;
  const publicPrefix = `${sourcePrefix}public/`;
  const sourceEntries = loadersFor(sourceLoaders, sourcePrefix);
  const publicEntries = loadersFor(publicTextLoaders, publicPrefix);
  const imageEntries = loadersFor(publicImageLoaders, publicPrefix);
  const standaloneEntries = loadersFor(standaloneLoaders, sourcePrefix);

  const [sourceValues, publicValues, imageValues, standaloneValues] = await Promise.all([
    Promise.all(sourceEntries.map(async ([path, loader]) => [path, await loader()] as const)),
    Promise.all(publicEntries.map(async ([path, loader]) => [path, await loader()] as const)),
    Promise.all(imageEntries.map(async ([path, loader]) => [path, await loader()] as const)),
    Promise.all(standaloneEntries.map(async ([path, loader]) => [path, await loader()] as const)),
  ]);

  const textValues = [...sourceValues, ...publicValues, ...standaloneValues];
  const files: Record<string, TutorialFile> = Object.fromEntries(
    textValues.map(([path, code]) => [toSandpackPath(path, sourcePrefix), { code }]),
  );
  if (meta.chapter === 1) {
    files["/src/index.js"] = { code: helloWorldAdapter, hidden: true };
    files["/public/index.html"] = {
      code: '<div id="root"></div>',
      hidden: true,
    };
  }
  const visibleFiles = [...sourceValues, ...standaloneValues]
    .map(([path]) => toSandpackPath(path, sourcePrefix))
    .sort((left, right) => left.localeCompare(right));
  const initialFile = files[meta.initialFile]
    ? meta.initialFile
    : visibleFiles[0] ?? meta.entryFile;
  const svgAssets = publicValues.filter(([path]) => path.endsWith(".svg"));
  const stylesheet = assetStylesheet(svgAssets, imageValues, publicPrefix);
  let lesson = sectionKey(meta.chapter, meta.slug) === "13/rq13-steps"
    ? rq13StepsLesson
    : buildLesson(meta.chapter, meta.title, visibleFiles);
  if (meta.runtime === "network") {
    lesson += `\n\n### External resource note\n\nThis example requests data or media from a public service. Its component code remains fully editable, but the final result also depends on that service being reachable and allowing requests from the Sandpack preview.`;
  } else if (meta.runtime === "adapted") {
    lesson += `\n\n### Preview adapter\n\nThe book presents this example as one standalone HTML file. The editor preserves that original file, while a hidden React entry reproduces its render call so the preview also works on plain-HTTP LAN addresses and static hosting.`;
  }

  return {
    ...meta,
    initialFile,
    files,
    visibleFiles,
    externalResources: stylesheet ? [stylesheet] : undefined,
    lesson,
  };
}
