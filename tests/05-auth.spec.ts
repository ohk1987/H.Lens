import { test, expect } from "@playwright/test";
import { TEST_ACCOUNTS } from "./fixtures/accounts";
import { login, logout } from "./helpers/auth";

test.describe("로그인", () => {
  test("로그인 페이지 정상 로드", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
    await expect(page.getByText("H.Lens에 오신 것을 환영합니다")).toBeVisible();
    await expect(page.getByRole("button", { name: "Google로 로그인" })).toBeVisible();
    await expect(page.getByRole("button", { name: "카카오로 로그인" })).toBeVisible();
    await expect(page.getByPlaceholder("you@example.com")).toBeVisible();
    await expect(page.getByPlaceholder("비밀번호")).toBeVisible();
  });

  test("test1 계정으로 로그인 성공", async ({ page }) => {
    await login(page, TEST_ACCOUNTS.jobseeker.email, TEST_ACCOUNTS.jobseeker.password);
    // 로그인 후 로그아웃 버튼 표시
    await expect(
      page.getByRole("button", { name: "로그아웃" })
    ).toBeVisible({ timeout: 10000 });
  });

  test("로그인 후 마이페이지 접근 가능", async ({ page }) => {
    await login(page, TEST_ACCOUNTS.jobseeker.email, TEST_ACCOUNTS.jobseeker.password);
    await page.goto("/my");
    await expect(page.getByRole("heading", { name: "마이페이지" })).toBeVisible({ timeout: 10000 });
  });

  test("로그아웃 정상 작동", async ({ page }) => {
    await login(page, TEST_ACCOUNTS.jobseeker.email, TEST_ACCOUNTS.jobseeker.password);
    await expect(page.getByRole("button", { name: "로그아웃" })).toBeVisible({
      timeout: 10000,
    });
    await logout(page);
    // 로그아웃 후 로그인 버튼 표시
    await expect(page.getByRole("link", { name: "로그인" })).toBeVisible({
      timeout: 10000,
    });
  });
});
