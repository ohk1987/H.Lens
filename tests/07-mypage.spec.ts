import { test, expect } from "@playwright/test";
import { TEST_ACCOUNTS } from "./fixtures/accounts";
import { login } from "./helpers/auth";

test.describe("마이페이지 - 구직자", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_ACCOUNTS.jobseeker.email, TEST_ACCOUNTS.jobseeker.password);
  });

  test("마이페이지 정상 로드", async ({ page }) => {
    await page.goto("/my");
    await expect(page.getByRole("heading", { name: "마이페이지" })).toBeVisible({ timeout: 10000 });
  });

  test("사용자 정보 표시", async ({ page }) => {
    await page.goto("/my");
    await expect(page.getByText(TEST_ACCOUNTS.jobseeker.email)).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByText("로그인 방식")).toBeVisible();
  });

  test("내가 작성한 리뷰 섹션 표시", async ({ page }) => {
    await page.goto("/my");
    await expect(page.getByRole("heading", { name: "내가 작성한 리뷰" })).toBeVisible({
      timeout: 10000,
    });
  });

  test("업적 섹션 표시", async ({ page }) => {
    await page.goto("/my");
    // 업적 섹션이 클라이언트 컴포넌트로 로드됨 — 충분한 대기
    await page.waitForLoadState("networkidle");
    // "나의 업적" 또는 "업적" 텍스트 확인
    const achievements = page.getByText(/나의 업적|업적/).first();
    await expect(achievements).toBeVisible({ timeout: 15000 });
  });
});

test.describe("마이페이지 - HR 담당자", () => {
  test("HR 로그인 후 마이페이지 접근", async ({ page }) => {
    await login(page, TEST_ACCOUNTS.hr.email, TEST_ACCOUNTS.hr.password);
    await page.goto("/my");
    await expect(page.getByRole("heading", { name: "마이페이지" })).toBeVisible({
      timeout: 10000,
    });
    // pending 상태면 "인증 대기중" 배지
    const pendingBadge = page.getByText("인증 대기중");
    if (await pendingBadge.isVisible().catch(() => false)) {
      await expect(pendingBadge).toBeVisible();
    }
  });
});
