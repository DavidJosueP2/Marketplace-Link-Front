import { test, expect } from "@playwright/test";

const BUYER_EMAIL = "buyer@example.com";
const MOD_EMAIL = "josuegarcab2@hotmail.com";
const PASSWORD = "password123";
const REPORT_REASON = "Estafa o fraude";
const REPORT_COMMENT = "Reporte automatizado desde Playwright";

test.describe("PS-MGI-001 - Buyer reporta y moderador visualiza incidencia", () => {
  test("flujo básico: buyer reporta, moderador verifica incidencia", async ({
    page,
  }) => {
    let incidenceShortId = "";

    await test.step("Buyer inicia sesión", async () => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      await page.locator('input[type="email"], input#email').fill(BUYER_EMAIL);
      await page
        .locator('input[type="password"], input#password')
        .fill(PASSWORD);
      await page
        .locator('button[type="submit"]')
        .filter({ hasText: /Entrar|Ingresar/i })
        .click();

      await page.waitForURL(/\/marketplace-refactored/, { timeout: 20000 });
    });

    await test.step("Buyer reporta la primera publicación disponible", async () => {
      await page.waitForLoadState("networkidle");

      const menuButton = page.locator('button[aria-haspopup="menu"]').first();
      await expect(menuButton).toBeVisible({ timeout: 15000 });
      await menuButton.click();

      const reportOption = page
        .locator("button")
        .filter({ hasText: /Reportar publicación/i })
        .first();
      await expect(reportOption).toBeVisible();
      await reportOption.click();

      await page
        .locator("select#report-reason")
        .selectOption({ label: REPORT_REASON });
      await page.locator("textarea#report-comment").fill(REPORT_COMMENT);

      const submitButton = page
        .locator("button")
        .filter({ hasText: /Enviar reporte/i })
        .first();
      await expect(submitButton).toBeEnabled();

      const responsePromise = page.waitForResponse((response) => {
        return (
          response.url().includes("/api/incidences/report") &&
          response.request().method() === "POST"
        );
      });

      await submitButton.click();
      const response = await responsePromise;
      const payload = await response.json();

      expect(response.ok()).toBeTruthy();
      expect(payload.incidence_id).toBeTruthy();
      incidenceShortId = `#${String(payload.incidence_id).substring(0, 8)}`;

      // No validamos el toast para evitar flakiness; el backend ya confirmó el reporte
    });

    await test.step("Cerrar sesión del buyer", async () => {
      await page.context().clearCookies();
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    });

    await test.step("Moderador inicia sesión", async () => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      await page.locator('input[type="email"], input#email').fill(MOD_EMAIL);
      await page
        .locator('input[type="password"], input#password')
        .fill(PASSWORD);
      await page
        .locator('button[type="submit"]')
        .filter({ hasText: /Entrar|Ingresar/i })
        .click();

      await page.waitForURL(/\/marketplace-refactored/, { timeout: 20000 });
    });

    await test.step("Moderador ve la incidencia creada", async () => {
      await page.goto("/marketplace-refactored/incidencias");
      await page.waitForLoadState("networkidle");

      const incidenceRow = page
        .locator("table")
        .locator("tr", {
          has: page.locator(`text=/${incidenceShortId.replace("#", "\\#")}/i`),
        })
        .first();

      await expect(incidenceRow).toBeVisible({ timeout: 20000 });
    });
  });
});
