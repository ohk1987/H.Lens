import { test, expect } from "@playwright/test";

test.describe("헤드헌터 목록/프로필", () => {
  test("페이지 정상 로드", async ({ page }) => {
    await page.goto("/headhunters");
    await expect(page.getByRole("heading", { name: "헤드헌터 목록" })).toBeVisible();
  });

  test("헤드헌터 카드 목록 표시", async ({ page }) => {
    await page.goto("/headhunters");
    await page.waitForSelector("[class*=animate-pulse]", {
      state: "detached",
      timeout: 10000,
    }).catch(() => {});
    const cards = page.locator("a[href^='/headhunters/']");
    await expect(cards.first()).toBeVisible({ timeout: 10000 });
  });

  test("검색창 입력 작동", async ({ page }) => {
    await page.goto("/headhunters");
    const searchInput = page.getByPlaceholder("이름 또는 서치펌 검색");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("김");
    await page.waitForTimeout(500);
  });

  test("직군 필터 존재", async ({ page }) => {
    await page.goto("/headhunters");
    const specialtySelect = page.locator("select").filter({ hasText: "전체 분야" });
    await expect(specialtySelect).toBeVisible();
  });

  test("기업 구분 필터 존재", async ({ page }) => {
    await page.goto("/headhunters");
    const companySizeSelect = page.locator("select").filter({ hasText: "전체 기업" });
    await expect(companySizeSelect).toBeVisible();
  });

  test("카드 클릭 → 프로필 페이지 이동", async ({ page }) => {
    await page.goto("/headhunters");
    await page.waitForSelector("[class*=animate-pulse]", {
      state: "detached",
      timeout: 10000,
    }).catch(() => {});

    const firstCard = page.locator("a[href^='/headhunters/']").first();
    await firstCard.click();
    await page.waitForURL(/\/headhunters\/.+/);
  });

  test("프로필 페이지: 주요 요소 표시", async ({ page }) => {
    await page.goto("/headhunters");
    await page.waitForSelector("[class*=animate-pulse]", {
      state: "detached",
      timeout: 10000,
    }).catch(() => {});

    const firstCard = page.locator("a[href^='/headhunters/']").first();
    await firstCard.click();
    await page.waitForURL(/\/headhunters\/.+/);

    // 프로필 로딩 대기 (프로필 로드 완료 또는 로딩 메시지 사라짐)
    await page.waitForSelector("text=프로필을 불러오는 중", {
      state: "detached",
      timeout: 15000,
    }).catch(() => {});

    // breadcrumb
    await expect(page.getByText("프로필")).toBeVisible({ timeout: 10000 });
    // 리뷰 섹션
    await expect(page.getByRole("heading", { name: "리뷰" })).toBeVisible({ timeout: 10000 });
  });
});
