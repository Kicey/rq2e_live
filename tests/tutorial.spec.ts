import { expect, test } from "@playwright/test";

async function expectWorkingTutorial(page: import("@playwright/test").Page) {
  await page.goto("/#/chapter/13/rq13-steps");
  await expect(page.getByRole("heading", { name: "Live preview" })).toBeVisible();

  const preview = page.frameLocator(".sandpack-preview iframe");
  await expect(preview.getByRole("heading", { name: "Task Manager" })).toBeVisible({ timeout: 30_000 });
  await expect.poll(
    () => preview.locator("img").evaluateAll((images) => images.every(
      (image) => getComputedStyle(image).content !== "normal",
    )),
  ).toBe(true);
  await preview.getByPlaceholder("Add new task").fill("Verify the live tutorial");
  await preview.getByRole("button", { name: "Add task" }).click();
  await expect(preview.getByText("Verify the live tutorial")).toBeVisible();
}

test("adds a task through the live preview", async ({ page }) => {
  await expectWorkingTutorial(page);
});

test("initializes the preview when SubtleCrypto is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.crypto, "subtle", {
      configurable: true,
      value: undefined,
    });
  });

  await expectWorkingTutorial(page);
});

test("loads the complete chapter and section catalog", async ({ page }) => {
  await page.goto("/#/chapter/13/rq13-steps");

  const chooser = page.getByRole("navigation", { name: "Tutorial contents" });
  await expect(chooser).toBeVisible();
  await expect(chooser.getByText("91 sections", { exact: true })).toBeVisible();
  await expect(chooser.locator(".chooser-chapter")).toHaveCount(13);
  await expect(chooser.locator(".chooser-section")).toHaveCount(91);
});

test("hides and restores the desktop section chooser", async ({ page }) => {
  await page.goto("/#/chapter/13/rq13-steps");

  const chooser = page.getByRole("navigation", { name: "Tutorial contents" });
  await expect(chooser).toBeVisible();
  await chooser.getByRole("button", { name: "Hide tutorial contents" }).click();
  await expect(chooser).toBeHidden();
  await expect(page.locator(".tutorial-shell")).toHaveClass(/sections-collapsed/);

  await page.getByRole("button", { name: "Show tutorial contents" }).click();
  await expect(chooser).toBeVisible();
});

test("opens the section chooser as a drawer on small screens", async ({ page }) => {
  await page.setViewportSize({ width: 560, height: 760 });
  await page.goto("/#/chapter/13/rq13-steps");

  const chooser = page.getByRole("navigation", { name: "Tutorial contents" });
  await expect(chooser).not.toBeInViewport();
  await page.getByRole("button", { name: "Show tutorial contents" }).click();
  await expect(chooser).toBeInViewport();
  await expect(chooser.getByRole("link", { name: /Adding steps to the task manager/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await chooser.getByRole("button", { name: "Hide tutorial contents" }).click();
  await expect(chooser).not.toBeInViewport();
});

test("uses the first section as the default route", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/#\/chapter\/1\/hello-world$/);
  await expect(page.getByText("hello-world", { exact: true }).first()).toBeVisible();

  await page.goto("/#/chapter/99/missing-section");
  await expect(page).toHaveURL(/#\/chapter\/1\/hello-world$/);
});

test("collapses and restores the code Explorer", async ({ page }) => {
  await page.goto("/#/chapter/13/rq13-steps");

  await expect(page.getByRole("complementary", { name: "Explorer" })).toBeVisible();
  await page.getByRole("button", { name: "Collapse Explorer" }).click();
  await expect(page.getByRole("complementary", { name: "Explorer" })).toHaveCount(0);
  await expect(page.locator(".workspace-panel")).toHaveClass(/explorer-collapsed/);

  await page.getByRole("button", { name: "Expand Explorer" }).click();
  await expect(page.getByRole("complementary", { name: "Explorer" })).toBeVisible();
});

test("collapses and restores folders in the file tree", async ({ page }) => {
  await page.goto("/#/chapter/13/rq13-steps");

  const srcFolder = page.getByRole("button", { name: "src folder" });
  await expect(srcFolder).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("button", { name: "App.js" })).toBeVisible();

  await srcFolder.click();
  await expect(srcFolder).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("button", { name: "App.js" })).toHaveCount(0);

  await srcFolder.click();
  await expect(srcFolder).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("button", { name: "App.js" })).toBeVisible();
});

test("scrolls long file trees independently", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 650 });
  await page.goto("/#/chapter/13/rq13-steps");

  const fileTree = page.locator(".file-tree");
  await expect(fileTree).toBeVisible();
  await expect.poll(() => fileTree.evaluate(
    (element) => element.scrollHeight > element.clientHeight,
  )).toBe(true);

  await fileTree.evaluate((element) => element.scrollTo({ top: element.scrollHeight }));
  await expect.poll(() => fileTree.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await expect(page.locator(".source-path")).toBeVisible();
});

test("renders representative standalone and asset-heavy sections", async ({ page }) => {
  const examples = [
    { path: "/#/chapter/1/hello-world", text: "Hello world!!!", images: false },
    { path: "/#/chapter/6/rq06-push-button", text: "Lock", images: true },
    { path: "/#/chapter/11/rq11-profile", text: "Home", images: true },
    { path: "/#/chapter/13/rq13-dragging", text: "Task Manager", images: true },
  ];

  for (const example of examples) {
    await page.goto(example.path);
    const preview = page.frameLocator(".sandpack-preview iframe");
    await expect(preview.getByText(example.text, { exact: true }).first()).toBeVisible({
      timeout: 40_000,
    });
    await expect(page.getByText("Something went wrong", { exact: true })).toHaveCount(0);
    if (example.images) {
      await expect.poll(
        () => preview.locator("img").evaluateAll((images) => images.length > 0 && images.every(
          (image) => getComputedStyle(image).content !== "normal",
        )),
      ).toBe(true);
    }
  }
});

test("renders the authored Chapter 5 sequence and runs every preview", async ({ page }) => {
  const preview = page.frameLocator(".sandpack-preview iframe");
  const openSection = async (slug: string, lessonHeading: string) => {
    await page.goto(`/#/chapter/5/${slug}`);
    await expect(page.locator(".lesson-explanation").getByRole("heading", {
      name: lessonHeading,
    })).toBeVisible();
    await expect(page.getByText("Something went wrong", { exact: true })).toHaveCount(0);
  };

  await openSection("rq05-functional-counter", "Why this counter needs state");
  const chapterFive = page.locator(".chooser-chapter").filter({
    has: page.locator(".chooser-chapter-heading", { hasText: "05" }),
  });
  await expect(chapterFive.locator(".chooser-section small")).toHaveText([
    "rq05-functional-counter",
    "rq05-triple-counter",
    "rq05-accordion",
    "rq05-calculator",
    "rq05-reset-counter",
    "rq05-bad-todo",
    "rq05-proper-todo",
    "rq05-filter-todo",
    "rq05-nice-todo",
  ]);
  await expect(preview.getByText("Counter: 0", { exact: true })).toBeVisible({ timeout: 30_000 });
  await preview.getByRole("button", { name: "Increment" }).click();
  await expect(preview.getByText("Counter: 1", { exact: true })).toBeVisible();

  await page.locator(".lesson-explanation").getByRole("link", {
    name: "rq05-triple-counter",
  }).click();
  await expect(page).toHaveURL(/#\/chapter\/5\/rq05-triple-counter$/);
  await expect(page.getByRole("heading", { name: "One definition creates three stateful instances" })).toBeVisible();
  await expect(preview.locator("p")).toHaveText(["Counter: 0", "Counter: 123", "Counter: -64"], {
    timeout: 30_000,
  });
  await preview.getByRole("button", { name: "Increment" }).first().click();
  await expect(preview.locator("p")).toHaveText(["Counter: 1", "Counter: 123", "Counter: -64"]);

  await openSection("rq05-accordion", "Model a local interface choice");
  await expect(preview.getByText("Password:")).toHaveCount(0);
  await preview.getByRole("button", { name: "+" }).click();
  await expect(preview.getByText("Password:")).toBeVisible({ timeout: 30_000 });
  await preview.getByRole("button", { name: "-" }).click();
  await expect(preview.getByText("Password:")).toHaveCount(0);

  await openSection("rq05-calculator", "Treat the selected operator as data");
  await expect(preview.locator("code")).toHaveText("11", { timeout: 30_000 });
  await preview.getByRole("button", { name: "Minus" }).click();
  await expect(preview.locator("code")).toHaveText("3");
  await preview.getByRole("button", { name: "Multiply" }).click();
  await expect(preview.locator("code")).toHaveText("28");

  await openSection("rq05-reset-counter", "Compare the two next-state decisions");
  await expect(preview.getByText("Counter: 0", { exact: true })).toBeVisible({ timeout: 30_000 });
  await preview.getByRole("button", { name: "Increment" }).click();
  await expect(preview.getByText("Counter: 1", { exact: true })).toBeVisible();
  await preview.getByRole("button", { name: "Reset" }).click();
  await expect(preview.getByText("Counter: 0", { exact: true })).toBeVisible();

  await openSection("rq05-bad-todo", "Reproduce the failure first");
  const badFirstTask = preview.locator("p").filter({ hasText: "Feed the plants" });
  await expect(badFirstTask).toBeVisible({ timeout: 30_000 });
  await badFirstTask.getByRole("button", { name: "x" }).click();
  await expect(badFirstTask).toBeVisible();

  await openSection("rq05-proper-todo", "Build a replacement without changing the old array");
  const properFirstTask = preview.locator("p").filter({ hasText: "Feed the plants" });
  await expect(properFirstTask).toBeVisible({ timeout: 30_000 });
  await properFirstTask.getByRole("button", { name: "x" }).click();
  await expect(properFirstTask).toHaveCount(0);

  await openSection("rq05-filter-todo", "Keep independent concerns in separate states");
  const filterFirstTask = preview.locator("p").filter({ hasText: "Feed the plants" });
  await expect(filterFirstTask).toBeVisible({ timeout: 30_000 });
  await filterFirstTask.getByRole("button", { name: "x" }).click();
  await expect(filterFirstTask.locator("strike")).toHaveText("Feed the plants");
  await preview.getByRole("button", { name: "Hide done" }).click();
  await expect(filterFirstTask).toHaveCount(0);

  await openSection("rq05-nice-todo", "Find the state owner");
  const niceFirstTask = preview.locator("p").filter({ hasText: "Feed the plants" });
  await expect(niceFirstTask).toBeVisible({ timeout: 30_000 });
  await niceFirstTask.getByRole("button").click();
  await expect(niceFirstTask.getByRole("button")).toHaveText("✓");
  await preview.getByRole("button", { name: "Hide done" }).click();
  await expect(niceFirstTask).toHaveCount(0);
});
