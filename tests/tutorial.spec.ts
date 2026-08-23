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
  await page.getByRole("button", { name: "Chapter 13" }).click();

  await expect(page.getByText("91 sections", { exact: true })).toBeVisible();
  await expect(page.locator(".menu-chapter")).toHaveCount(13);
  await expect(page.locator(".menu-section")).toHaveCount(91);
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
