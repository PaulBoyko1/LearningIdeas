import { expect, test } from "@playwright/test";

async function waitForTrack(page) {
  await expect(page.getByRole("heading", { name: "MarketGlass: learn the research loop before trusting the result." })).toBeVisible();
}

test.describe("MarketGlass learning track", () => {
  test.use({ viewport: { width: 1440, height: 960 } });

  test("teaches a concept, records progress, and gives scenario feedback", async ({ page }) => {
    await page.goto("/");
    await waitForTrack(page);
    await expect(page.locator("#loop-canvas")).toBeVisible();
    await page.getByRole("button", { name: /Name the uncertainty/ }).click();
    await page.getByRole("button", { name: /Implied volatility/ }).click();
    await expect(page.locator(".detail-heading")).toHaveText("Implied volatility");
    await page.getByRole("button", { name: "Mark concept explored", exact: true }).click();
    await expect(page.locator("#progress-summary")).toContainText("1/11 concepts");
    await page.locator("#scenario-select").selectOption("surface-gap");
    await page.getByRole("button", { name: /Inspect raw points/ }).click();
    await expect(page.locator("#practice-feedback")).toContainText("A useful next move");
    await expect(page.locator("#practice-feedback")).toContainText("quality limits remain visible");
  });
});

test.describe("LearningIdeas mobile layout", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("keeps the project-separated lesson readable without horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await waitForTrack(page);
    const geometry = await page.locator("#loop-canvas").evaluate((canvas) => ({
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    }));
    expect(geometry.width).toBeGreaterThan(280);
    expect(geometry.height).toBeGreaterThan(180);
    expect(geometry.overflow).toBeLessThanOrEqual(1);
  });
});
