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
