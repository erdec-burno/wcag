import { test, expect } from "@playwright/test";
test("full reset flow and token reuse", async ({ page }) => {
  await page.goto("/forgot-password");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByRole("button", { name: "Отправить инструкцию" }).click();
  const link = page.getByRole("link", { name: "Открыть демо-ссылку сброса" });
  const resetUrl = await link.getAttribute("href");
  await link.click();
  await page.getByLabel("Новый пароль", { exact: true }).fill("NewPassword123");
  await page.getByLabel("Повторите пароль").fill("Mismatch123");
  await page.getByRole("button", { name: "Сохранить пароль" }).click();
  await expect(
    page.getByText("Пароли не совпадают.", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Повторите пароль").fill("NewPassword123");
  await page.getByRole("button", { name: "Сохранить пароль" }).click();
  await expect(page).toHaveURL(/login/);
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Пароль", { exact: true }).fill("Demo12345!");
  await page.getByRole("button", { name: "Войти в кабинет" }).click();
  await expect(page.getByRole("alert")).toContainText("Неверный");
  await page.getByLabel("Пароль", { exact: true }).fill("NewPassword123");
  await page.getByRole("button", { name: "Войти в кабинет" }).click();
  await expect(page).toHaveURL(/dashboard/);
  await page.getByRole("button", { name: "Выйти", exact: true }).click();
  await page.goto(resetUrl!);
  await page.getByLabel("Новый пароль", { exact: true }).fill("Another123");
  await page.getByLabel("Повторите пароль").fill("Another123");
  await page.getByRole("button", { name: "Сохранить пароль" }).click();
  await expect(page.getByRole("alert")).toContainText("Ссылка недействительна");
});
