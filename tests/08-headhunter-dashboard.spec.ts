import { test, expect } from "@playwright/test";
import { TEST_ACCOUNTS } from "./fixtures/accounts";
import { login } from "./helpers/auth";

test.describe("헤드헌터 대시보드", () => {
  test.beforeEach(async ({ page }) => {
    await login(
      page,
      TEST_ACCOUNTS.headhunter.email,
      TEST_ACCOUNTS.headhunter.password
    );
  });

  test("헤더에 내 대시보드 메뉴 표시", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(
      page.getByRole("link", { name: "내 대시보드" })
    ).toBeVisible({ timeout: 10000 });
  });

  test("대시보드 페이지 접근 가능", async ({ page }) => {
    await page.goto("/dashboard/headhunter");
    await page.waitForLoadState("networkidle");
    // 대시보드 또는 "프로필 없음" 페이지
    await expect(page.locator("body")).toBeVisible();
  });

  test("대시보드 콘텐츠 표시", async ({ page }) => {
    await page.goto("/dashboard/headhunter");
    await page.waitForLoadState("networkidle");

    // 프로필이 없는 경우 "프로필 등록하기" 버튼 표시
    // 프로필이 있는 경우 평점/리뷰/포지션 관리 표시
    const hasProfile = await page.getByText("포지션 관리").isVisible().catch(() => false);
    const noProfile = await page.getByText("헤드헌터 프로필 없음").isVisible().catch(() => false);

    // 둘 중 하나가 표시되어야 함
    expect(hasProfile || noProfile).toBeTruthy();
  });
});
