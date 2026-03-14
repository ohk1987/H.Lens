import { test, expect } from "@playwright/test";
import { TEST_ACCOUNTS } from "./fixtures/accounts";
import { login } from "./helpers/auth";

// StarRating 컴포넌트에서 별 클릭: SVG 위에 투명 div 오버레이가 있음
// 왼쪽 반 = star - 0.5점, 오른쪽 반 = star점
// 4점 주기: 4번째 별의 오른쪽 div 클릭 (right half)
async function clickStarRating(
  page: import("@playwright/test").Page,
  containerIndex: number,
  starValue: number
) {
  const container = page.locator(".flex.gap-0\\.5").nth(containerIndex);
  // starValue 기준으로 몇 번째 별인지 계산
  const starIndex = Math.ceil(starValue) - 1; // 0-based
  const isHalf = starValue % 1 !== 0;
  const starDiv = container.locator("> div").nth(starIndex);
  // 왼쪽 반 div (index 0) = half star, 오른쪽 반 div (index 1) = full star
  if (isHalf) {
    await starDiv.locator("> div").nth(0).click({ force: true });
  } else {
    await starDiv.locator("> div").nth(1).click({ force: true });
  }
}

test.describe("리뷰 작성", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_ACCOUNTS.jobseeker.email, TEST_ACCOUNTS.jobseeker.password);
  });

  test("리뷰 작성 페이지 로드", async ({ page }) => {
    await page.goto("/reviews/new");
    await expect(page.getByText("헤드헌터 정보")).toBeVisible({ timeout: 10000 });
  });

  test("전체 리뷰 작성 플로우", async ({ page }) => {
    test.setTimeout(120000);
    await page.goto("/reviews/new");
    await page.waitForLoadState("networkidle");

    // === 1단계: 헤드헌터 검색 ===
    const searchInput = page.getByPlaceholder("헤드헌터 이름으로 검색");
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.fill("김");
    await page.waitForTimeout(1500);

    // 검색 결과 드롭다운에서 첫 번째 헤드헌터 선택
    const dropdown = page.locator("[class*=absolute][class*=shadow]");
    const firstResult = dropdown.locator("button").first();
    const hasResult = await firstResult.isVisible().catch(() => false);

    if (hasResult) {
      await firstResult.click();
      await expect(page.getByText("선택됨")).toBeVisible();
    } else {
      await page.getByText("신규 헤드헌터 등록하기", { exact: false }).click();
      await page.getByPlaceholder("헤드헌터 이름").fill("테스트 헤드헌터");
      await page.getByPlaceholder("headhunter@searchfirm.com").fill("test-hh@example.com");
      await page.getByPlaceholder("010-0000-0000").fill("01012345678");
      const firmSelect = page.locator("select").filter({ hasText: "서치펌을 선택하세요" });
      await firmSelect.selectOption({ index: 1 });
    }

    await page.getByRole("button", { name: "다음" }).click();

    // === 2단계: 기본 정보 ===
    await expect(page.getByText("포지션 제안 받은 날짜")).toBeVisible({ timeout: 5000 });

    await page.locator("input[type='date']").fill("2025-06-15");
    await page.getByRole("button", { name: "LinkedIn" }).click();
    await page.getByPlaceholder("제안받은 회사명").fill("테스트 회사");
    await page.getByRole("button", { name: "스타트업" }).click();
    await page.getByRole("button", { name: "IT/소프트웨어" }).click();
    await page.getByRole("button", { name: "개발/엔지니어링" }).click();
    await page.getByRole("button", { name: "3~7년" }).click();
    await page.getByRole("button", { name: "진행 중" }).click();

    await page.getByRole("button", { name: "다음" }).click();

    // === 3단계: 평점 ===
    await page.waitForTimeout(500);
    // 5개 공통 항목에 각각 4점 클릭
    const starGroupCount = await page.locator(".flex.gap-0\\.5").count();
    for (let i = 0; i < starGroupCount; i++) {
      await clickStarRating(page, i, 4);
    }

    await page.getByRole("button", { name: "다음" }).click();

    // === 4단계: 키워드 & 리뷰 ===
    await page.waitForTimeout(500);
    const keyword = page.getByRole("button", { name: "전문적" });
    if (await keyword.isVisible().catch(() => false)) {
      await keyword.click();
    }

    await page.locator("textarea").fill(
      "테스트 리뷰입니다. 이 헤드헌터는 매우 전문적이고 친절하게 상담해주셨습니다. 포지션에 대한 설명도 자세히 해주셨고 전반적으로 좋은 경험이었습니다."
    );

    await page.getByRole("button", { name: "다음" }).click();

    // === 5단계: 종합 평점 & 제출 ===
    await page.waitForTimeout(500);
    // 종합 평점 4점
    await clickStarRating(page, 0, 4);

    // 추천 여부
    await page.getByRole("button", { name: "예, 추천합니다" }).click();

    // 제출
    await page.getByRole("button", { name: "리뷰 제출" }).click();

    // 성공 확인
    await expect(
      page.getByText("리뷰가 제출되었습니다", { exact: false })
    ).toBeVisible({ timeout: 15000 });
  });
});
