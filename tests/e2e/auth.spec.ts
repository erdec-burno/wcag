import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("mobile navigation overlays content and restores desktop sidebar on resize", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Пароль", { exact: true }).fill("Demo12345!");
  await page.getByRole("button", { name: "Войти в кабинет" }).click();
  await expect(page).toHaveURL(/admin\/dashboard/);
  // Radix hides the background from assistive technology while the modal is open.
  const toggle = page.getByRole("button", {
    name: "Открыть меню",
    includeHidden: true,
  });
  await expect(toggle).not.toBeVisible();
  await page.setViewportSize({ width: 320, height: 740 });
  await expect(
    page.getByRole("navigation", { name: "Основная навигация" }),
  ).not.toBeVisible();
  await expect(page.locator(".admin-topbar")).toHaveJSProperty("offsetTop", 0);
  await toggle.focus();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: "Меню", exact: true });
  await expect(drawer).toBeVisible();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    expect(
      await drawer.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page.mouse.click(310, 100);
  await expect(drawer).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await drawer.getByRole("link", { name: "Dashboard" }).click();
  await expect(drawer).not.toBeVisible();
  await toggle.click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(drawer).not.toBeVisible();
  await expect(toggle).not.toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Основная навигация" }),
  ).toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.setViewportSize({ width: 320, height: 740 });
  await page.getByRole("button", { name: "Тёмная тема" }).click();
  await toggle.click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await drawer.getByRole("button", { name: "Закрыть меню" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(
    drawer.getByRole("button", { name: "Выйти", exact: true }),
  ).toBeFocused();
  await drawer.getByRole("button", { name: "Закрыть меню" }).click();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await drawer.getByRole("button", { name: "Выйти", exact: true }).click();
  await expect(page).toHaveURL(/login/);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});
test("topbar security dialog and profile popover support keyboard, themes and mobile", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Пароль", { exact: true }).fill("Demo12345!");
  await page.getByRole("button", { name: "Войти в кабинет" }).click();
  await expect(page).toHaveURL(/admin\/dashboard/);
  const profile = page.getByRole("button", { name: "PROFILE", exact: true });
  const security = page.getByRole("button", {
    name: "SECURITY",
    exact: true,
  });
  await profile.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Профиль" })).toContainText(
    "admin@example.com",
  );
  const profilePanel = page.getByRole("dialog", { name: "Профиль" });
  await expect(profilePanel).toHaveAttribute("data-side", "bottom");
  expect((await profilePanel.boundingBox())!.y).toBeGreaterThanOrEqual(
    (await profile.boundingBox())!.y + (await profile.boundingBox())!.height,
  );
  await expect(page.getByRole("main")).toBeVisible();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(profile).toBeFocused();
  await profile.click();
  await page.getByRole("heading", { name: "Dashboard", exact: true }).click();
  await expect(profilePanel).not.toBeVisible();
  for (const dark of [false, true]) {
    if (dark) await page.getByRole("button", { name: "Тёмная тема" }).click();
    await security.click();
    const dialog = page.getByRole("dialog", { name: "Безопасность" });
    await expect(
      dialog.getByRole("link", { name: "Сменить пароль" }),
    ).toHaveAttribute("href", "/forgot-password");
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(security).toBeFocused();
    await page.setViewportSize({ width: 320, height: 740 });
    await expect(profile).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await profile.click();
  await page.getByRole("button", { name: "Закрыть", exact: true }).click();
  await expect(profile).toBeFocused();
  await security.click();
  await page.getByRole("link", { name: "Сменить пароль" }).click();
  await expect(page).toHaveURL(/forgot-password/);
});
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
