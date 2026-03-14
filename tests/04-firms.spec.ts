import { test, expect } from "@playwright/test";

test.describe("서치펌", () => {
  test("페이지 정상 로드", async ({ page }) => {
    await page.goto("/firms");
    await expect(page.getByRole("heading", { name: "서치펌 목록" })).toBeVisible();
  });

  test("서치펌 카드 목록 표시", async ({ page }) => {
    await page.goto("/firms");
    const cards = page.locator("a[href^='/firms/']");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
  });

  test("카드 클릭 → 서치펌 상세 이동", async ({ page }) => {
    await page.goto("/firms");
    const cards = page.locator("a[href^='/firms/']");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    await cards.first().click();
    await page.waitForURL(/\/firms\/.+/);
  });

  test("서치펌 상세: 정보 표시", async ({ page }) => {
    await page.goto("/firms");
    const cards = page.locator("a[href^='/firms/']");
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    await cards.first().click();
    await page.waitForURL(/\/firms\/.+/);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
  });
});
