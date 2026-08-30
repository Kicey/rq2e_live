import { describe, expect, it } from "vitest";
import { chapters, getSection, loadSection, sections } from "./chapters";

describe("tutorial content registry", () => {
  it("discovers every example in the rq2e submodule", () => {
    expect(sections).toHaveLength(91);
    expect(chapters).toHaveLength(13);
    expect(chapters[0].sections[0].slug).toBe("hello-world");
    expect(sections.filter((section) => section.runtime === "adapted")).toHaveLength(1);
    expect(sections.filter((section) => section.runtime === "network")).toHaveLength(3);
  });

  it("lazily loads the complete rq13-steps source project", async () => {
    const meta = getSection("13", "rq13-steps");

    expect(meta).toBeDefined();
    const section = await loadSection(meta!);
    expect(section.visibleFiles).toHaveLength(21);
    expect(section.files["/src/index.js"].code).toContain("createRoot");
    expect(section.files["/src/task/TaskProvider.js"].code).toContain("TaskContext.Provider");
    expect(section.files["/public/icons/plus.svg"].code).toContain("<svg");
    expect(section.externalResources?.[0]).toMatch(/^data:text\/css/);
  });

  it("presents Chapter 5 in teaching order with its authored lessons", async () => {
    const teachingOrder = [
      "rq05-functional-counter",
      "rq05-triple-counter",
      "rq05-accordion",
      "rq05-calculator",
      "rq05-reset-counter",
      "rq05-bad-todo",
      "rq05-proper-todo",
      "rq05-filter-todo",
      "rq05-nice-todo",
    ];
    const chapter = chapters.find((item) => item.number === 5);

    expect(chapter?.sections.map((section) => section.slug)).toEqual(teachingOrder);

    const loaded = await Promise.all(chapter!.sections.map(loadSection));
    const internalLinks = loaded.flatMap((section, index) => {
      expect(section.lesson).toContain(`example ${index + 1} of 9`);
      expect(section.lesson).toContain("*Book context:");
      expect(section.lesson).not.toContain("### What this section isolates");
      return [...section.lesson.matchAll(/\]\(#\/chapter\/5\/([^)]+)\)/g)]
        .map((match) => match[1]);
    });

    expect(internalLinks).toHaveLength(23);
    for (const slug of internalLinks) {
      expect(getSection("5", slug), slug).toBeDefined();
    }
  });

  it("loads the standalone first chapter through a hidden React adapter", async () => {
    const meta = getSection("1", "hello-world");
    const section = await loadSection(meta!);

    expect(section.template).toBe("react");
    expect(section.visibleFiles).toEqual(["/index.html"]);
    expect(section.files["/index.html"].code).toContain("ReactDOM.createRoot");
    expect(section.files["/src/index.js"].hidden).toBe(true);
  });

  it("loads every registered section with an entry and editable source", async () => {
    for (const meta of sections) {
      const section = await loadSection(meta);
      expect(section.visibleFiles.length, meta.sourcePath).toBeGreaterThan(0);
      expect(section.files[section.entryFile], meta.sourcePath).toBeDefined();
      expect(section.files[section.initialFile], meta.sourcePath).toBeDefined();
    }
  });

  it("uses a unique chapter and slug for every section", () => {
    const keys = sections.map((section) => `${section.chapter}/${section.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
