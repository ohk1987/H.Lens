import { test, expect } from "@playwright/test";

const pages = [
  { path: "/about", heading: "H.Lens" },
  { path: "/terms", heading: "이용약관" },
  { path: "/privacy", heading: "개인정보처리방침" },
  { path: "/review-guidelines", heading: "리뷰 가이드" },
  { path: "/support", heading: "고객" },
  { path: "/articles", heading: "아티클" },
];

test.describe("정보 페이지", () => {
  for (const { path, heading } of pages) {
    test(`${path} 정상 로드`, async ({ page }) => {
      await page.goto(path);
      await expect(
        page.getByRole("heading", { name: new RegExp(heading) }).first()
      ).toBeVisible({ timeout: 10000 });
    });
  }

  test("/community 준비 중 페이지 표시", async ({ page }) => {
    await page.goto("/community");
    await expect(
      page.getByText("준비 중", { exact: false }).first()
    ).toBeVisible({ timeout: 10000 });
  });
});
