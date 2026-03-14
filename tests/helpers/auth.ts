import { type Page } from "@playwright/test";

export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  const emailInput = page.getByPlaceholder("you@example.com");
  await emailInput.waitFor({ state: "visible", timeout: 15000 });
  await emailInput.fill(email);
  await page.getByPlaceholder("비밀번호").fill(password);
  await page.getByRole("button", { name: "이메일로 로그인" }).click();
  // 로그인 후 리다이렉트 대기
  await page.waitForURL((url) => !url.pathname.includes("/login"), {
    timeout: 15000,
  });
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: "로그아웃" }).click();
  await page.waitForURL("/");
}
