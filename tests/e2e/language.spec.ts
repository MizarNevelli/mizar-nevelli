import { test, expect } from "@playwright/test";

test.describe("i18n language switching", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage so we always start from browser-detected language
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("page loads in English by default", async ({ page }) => {
    // The nav link to the About page should say "About" in English
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  });

  test("switching to Italian updates visible text", async ({ page }) => {
    // Open language switcher and select Italian
    const langSwitcher = page.getByRole("button", { name: /language|lingua|IT|EN/i });
    await langSwitcher.first().click();

    const itOption = page.getByRole("button", { name: /italiano|IT/i });
    if (await itOption.isVisible()) {
      await itOption.click();
    }

    // "Chi sono" is the Italian translation of "About"
    await expect(page.getByRole("link", { name: "Chi sono" })).toBeVisible();
  });

  test("selected language persists across reload", async ({ page }) => {
    // Switch to Italian
    const langSwitcher = page.getByRole("button", { name: /language|lingua|IT|EN/i });
    await langSwitcher.first().click();

    const itOption = page.getByRole("button", { name: /italiano|IT/i });
    if (await itOption.isVisible()) {
      await itOption.click();
    }

    await page.reload();

    // Should still be Italian after reload
    await expect(page.getByRole("link", { name: "Chi sono" })).toBeVisible();
  });
});
