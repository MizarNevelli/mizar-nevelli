import { test, expect } from "@playwright/test";

test.describe("Closures visualizer", () => {
  test.beforeEach(async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/closures");
    // Store errors reference — checked per-test
    (page as any)._jsErrors = errors;
  });

  test("idle state: Run button visible, Pause and Reset absent", async ({
    page,
  }) => {
    await expect(page.getByRole("button", { name: /run/i })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /pause/i })
    ).not.toBeVisible();
    await expect(
      page.getByRole("button", { name: /reset/i })
    ).not.toBeVisible();
  });

  test("clicking Run transitions to running state", async ({ page }) => {
    await page.getByRole("button", { name: /run/i }).click();
    await expect(page.getByRole("button", { name: /pause/i })).toBeVisible();
  });

  test("regression: switching scenario mid-play does not crash (frame.line bug)", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    // Start playing the first scenario (basic)
    await page.getByRole("button", { name: /run/i }).click();
    // Step forward a couple of times to get step > 0
    await page.getByRole("button", { name: /pause/i }).click();
    const nextBtn = page.getByRole("button", { name: /next/i });
    await nextBtn.click();
    await nextBtn.click();

    // Switch to a different scenario — this triggered the crash before the fix
    const scenarioSelector = page.getByRole("button", { name: /counter/i });
    if (await scenarioSelector.isVisible()) {
      await scenarioSelector.click();
    } else {
      // Fallback: find a tab/select for scenario switching
      const select = page.locator("select, [role=tab]").first();
      await select.click();
    }

    // No JS error should have been thrown
    expect(
      errors.filter((e) => e.includes("Cannot read properties of undefined")),
      "frame.line crash occurred after scenario switch"
    ).toHaveLength(0);
  });

  test("Reset returns to idle state", async ({ page }) => {
    await page.getByRole("button", { name: /run/i }).click();
    await page.getByRole("button", { name: /pause/i }).click();
    await page.getByRole("button", { name: /reset/i }).click();
    await expect(page.getByRole("button", { name: /run/i })).toBeVisible();
  });
});
