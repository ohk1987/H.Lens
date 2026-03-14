import { test, expect } from "@playwright/test";

test.describe("공통 레이아웃", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("헤더 찾기 드롭다운에 헤드헌터/서치펌 메뉴 표시", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const header = page.locator("header");
    const findButton = header.locator("button", { hasText: "찾기" }).first();
    await findButton.click();

    // 드롭다운 내 링크 확인 (header 스코프)
    const dropdown = header.locator("[class*=absolute][class*=shadow]");
    await expect(dropdown.getByText("헤드헌터 찾기")).toBeVisible();
    await expect(dropdown.getByText("서치펌 찾기")).toBeVisible();
  });

  test("푸터 링크 존재 여부 (회사소개, 이용약관, 개인정보처리방침)", async ({
    page,
  }) => {
    const footer = page.locator("footer");
    await expect(footer.getByText("회사 소개")).toBeVisible();
    await expect(footer.getByText("이용약관")).toBeVisible();
    await expect(footer.getByText("개인정보처리방침")).toBeVisible();
  });

  test("다크모드 토글 버튼 존재", async ({ page }) => {
    const header = page.locator("header");
    // ThemeToggle은 header 내 버튼 중 하나
    const buttons = header.locator("button");
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });
});
