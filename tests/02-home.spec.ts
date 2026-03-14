import { test, expect } from "@playwright/test";

test.describe("홈 화면", () => {
  test.describe.configure({ mode: "serial" });

  test("홈 페이지 정상 로드", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/H\.Lens/i);
  });

  test("Hero 섹션 표시", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("당신의 커리어를 바꿀")
    ).toBeVisible({ timeout: 10000 });
  });

  test("통계 숫자 표시", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("누적 리뷰")
    ).toBeVisible({ timeout: 10000 });
  });

  test("미션 섹션 표시", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText("헤드헌팅 시장의 투명성을 만듭니다")
    ).toBeVisible({ timeout: 10000 });
  });

  test("CTA 버튼 존재 (헤드헌터 찾기, 리뷰 작성하기)", async ({ page }) => {
    await page.goto("/");
    const main = page.getByRole("main");
    await expect(
      main.getByRole("link", { name: /헤드헌터 찾기/ }).first()
    ).toBeVisible({ timeout: 10000 });
    await expect(
      main.getByRole("link", { name: /리뷰 작성/ }).first()
    ).toBeVisible({ timeout: 10000 });
  });

  test("최신 리뷰 카드 표시", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByText(/최근 리뷰|최신 리뷰/).first()
    ).toBeVisible({ timeout: 10000 });
  });
});
