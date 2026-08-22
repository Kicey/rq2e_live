import { describe, expect, it } from "vitest";
import { getSection, sections } from "./chapters";

describe("tutorial content registry", () => {
  it("loads the complete rq13-steps source project", () => {
    const section = getSection("13", "rq13-steps");

    expect(section).toBeDefined();
    expect(section?.visibleFiles).toHaveLength(21);
    expect(section?.files["/src/index.js"].code).toContain("createRoot");
    expect(section?.files["/src/task/TaskProvider.js"].code).toContain("TaskContext.Provider");
    expect(section?.files["/public/icons/plus.svg"].code).toContain("<svg");
  });

  it("uses a unique chapter and slug for every section", () => {
    const keys = sections.map((section) => `${section.chapter}/${section.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
