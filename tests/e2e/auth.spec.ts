import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("protected route, invalid login, dashboard, persisted session and logout", async ({
  page,
}) => {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/login/);
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Пароль", { exact: true }).fill("wrong");
  await page.getByRole("button", { name: "Войти в кабинет" }).click();
  await expect(page.getByRole("alert")).toContainText("Неверный");
  await page.getByLabel("Пароль", { exact: true }).fill("Demo12345!");
  await page.getByRole("button", { name: "Войти в кабинет" }).click();
  await expect(page).toHaveURL(/admin\/dashboard/);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await page.getByRole("button", { name: "Выйти", exact: true }).click();
  await expect(page).toHaveURL(/login/);
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/login/);
});
test("login is accessible in both themes and narrow viewport", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "С возвращением" }),
  ).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "Тёмная тема" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
