import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@example.com");
  await page.getByLabel("Пароль", { exact: true }).fill("Demo12345!");
  await page.getByRole("button", { name: "Войти в кабинет" }).click();
  await expect(page).toHaveURL(/admin\/dashboard/);
  await page.evaluate(() => document.fonts.ready);
}

async function checkReflow(page: Page) {
  const overflow = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    elements: [...document.querySelectorAll("body *")]
      .filter(
        (element) => element.getBoundingClientRect().right > innerWidth + 1,
      )
      .map((element) => ({
        tag: element.tagName,
        className: element.className,
        right: element.getBoundingClientRect().right,
      })),
  }));
  expect(overflow.scrollWidth, JSON.stringify(overflow)).toBeLessThanOrEqual(
    overflow.width,
  );
  const clipped = await page
    .locator("button:visible, a:visible, .topbar-label:visible")
    .evaluateAll((elements) =>
      elements
        .filter(
          (element) =>
            element.scrollWidth > element.clientWidth + 1 ||
            element.scrollHeight > element.clientHeight + 1,
        )
        .map((element) => element.textContent?.trim()),
    );
  expect(clipped).toEqual([]);
}

test("full admin page has no automated accessibility violations in both themes", async ({
  page,
}) => {
  await login(page);
  for (const dark of [false, true]) {
    if (dark) await page.getByRole("button", { name: "Тёмная тема" }).click();
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 800 });
      await expect(page.getByRole("dialog")).not.toBeVisible();
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
            .withRules(["label-content-name-mismatch"])
            .analyze()
        ).violations,
      ).toEqual([]);
      for (const name of ["SECURITY", "PROFILE"]) {
        const button = page.getByRole("button", { name, exact: true });
        await expect(button).toHaveAccessibleName(name);
        await button.focus();
        await page.keyboard.press("Shift+Tab");
        await page.keyboard.press("Tab");
        await expect(button).toBeFocused();
        expect(
          await button.evaluate((element) => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            const hit = document.elementFromPoint(
              rect.x + rect.width / 2,
              rect.y + rect.height / 2,
            );
            return (
              style.outlineStyle !== "none" &&
              parseFloat(style.outlineWidth) > 0 &&
              !!hit &&
              element.contains(hit) &&
              rect.width >= 24 &&
              rect.height >= 24
            );
          }),
        ).toBe(true);
      }
      await checkReflow(page);
    }
  }
  const skip = page.getByRole("link", { name: "Перейти к содержимому" });
  await skip.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

test("admin and mobile menu remain usable with enlarged text and WCAG text spacing", async ({
  page,
}) => {
  await login(page);
  await page.addStyleTag({
    content: `
    html { font-size: 200%; }
    * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
    p { margin-bottom: 2em !important; }
  `,
  });
  for (const dark of [false, true]) {
    if (dark) await page.getByRole("button", { name: "Тёмная тема" }).click();
    for (const width of [1280, 320]) {
      await page.setViewportSize({ width, height: 800 });
      await checkReflow(page);
      const profile = page.getByRole("button", {
        name: "PROFILE",
        exact: true,
      });
      await profile.click();
      const profileDialog = page.getByRole("dialog", { name: "Профиль" });
      expect(
        await profileDialog.evaluate(
          (element) => element.scrollWidth <= element.clientWidth + 1,
        ),
      ).toBe(true);
      await page.keyboard.press("Escape");
      await expect(profile).toBeFocused();
    }
    await page.getByRole("button", { name: "Открыть меню" }).click();
    const menu = page.getByRole("dialog", { name: "Меню", exact: true });
    expect(
      await menu.evaluate(
        (element) => element.scrollWidth <= element.clientWidth + 1,
      ),
    ).toBe(true);
    await menu.getByRole("button", { name: "Выйти", exact: true }).focus();
    await expect(
      menu.getByRole("button", { name: "Выйти", exact: true }),
    ).toBeInViewport();
    await page.keyboard.press("Escape");
  }
});
