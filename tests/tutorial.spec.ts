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
