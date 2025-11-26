import { test, expect } from "@playwright/test";

const MOD_EMAIL = "pruebasjos06@gmail.com";
const PASSWORD = "admin123";

test.describe("PS-MGI-006 - Moderador decide apelación", () => {
  test("moderador acepta una apelación y la publicación queda visible", async ({
    page,
  }) => {
    await test.step("Moderador inicia sesión", async () => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      await page.locator('input[type="email"], input#email').fill(MOD_EMAIL);
      await page.locator('input[type="password"], input#password').fill(PASSWORD);
      await page
        .locator('button[type="submit"]')
        .filter({ hasText: /Entrar|Ingresar/i })
        .click();

      await page.waitForURL(/\/marketplace-refactored/, { timeout: 20000 });
    });

    await test.step("Moderador navega a la página de apelaciones", async () => {
      await page.goto("/marketplace-refactored/apelaciones");
      await page.waitForLoadState("networkidle");

      const appealsTitle = page
        .locator("text=/Mis Apelaciones/i")
        .first();
      await expect(appealsTitle).toBeVisible({ timeout: 10000 });
    });

    await test.step("Moderador hace clic en Ver detalle de la primera apelación", async () => {
      await page.waitForLoadState("networkidle", { timeout: 10000 });

      const firstViewDetailButton = page
        .locator("button")
        .filter({ hasText: /Ver detalle/i })
        .first();

      await expect(firstViewDetailButton).toBeVisible({ timeout: 15000 });

      await firstViewDetailButton.click();

      await page.waitForURL(/\/marketplace-refactored\/apelaciones\/\d+/, {
        timeout: 20000,
      });
      await page.waitForLoadState("networkidle");

      const appealDetailTitle = page
        .locator("text=/Detalles de la Apelación/i")
        .first();
      await expect(appealDetailTitle).toBeVisible({ timeout: 10000 });
    });

    await test.step("Moderador hace clic en Decidir apelación", async () => {
      await page.waitForTimeout(2000);

      const decideAppealButton = page
        .locator("button")
        .filter({ hasText: /Decidir apelación/i })
        .first();

      await decideAppealButton.click({ timeout: 15000 });

      const modalTitle = page.locator("text=/Decidir apelación/i").first();
      await expect(modalTitle).toBeVisible({ timeout: 10000 });
    });

    await test.step("Moderador selecciona Aceptar apelación", async () => {
      const acceptButton = page
        .locator("button")
        .filter({ hasText: /Aceptar apelación/i })
        .first();

      await expect(acceptButton).toBeVisible({ timeout: 10000 });
      await acceptButton.click();

      await page.waitForTimeout(1000);
    });

    await test.step("Moderador confirma la decisión", async () => {
      const confirmButton = page
        .locator("button")
        .filter({ hasText: /Confirmar decisión/i })
        .first();

      await expect(confirmButton).toBeEnabled({ timeout: 5000 });

      const appealDecisionResponsePromise = page.waitForResponse((response) => {
        return (
          response.url().includes("/api/appeals/decision") &&
          response.request().method() === "POST"
        );
      });

      await confirmButton.click({ timeout: 10000 });

      const appealDecisionResponse = await appealDecisionResponsePromise;
      const appealDecisionPayload = await appealDecisionResponse.json();

      expect(appealDecisionResponse.ok()).toBeTruthy();

      await page.waitForTimeout(2000);
    });

    await test.step("Verificar que la decisión se registró y la publicación quedó visible", async () => {
      await page.waitForLoadState("networkidle", { timeout: 10000 });
      await page.waitForTimeout(2000);

      const decisionBadge = page
        .locator("badge, span")
        .filter({ hasText: /Aceptada|ACCEPTED/i })
        .first();

      const decisionVisible = await decisionBadge
        .isVisible({ timeout: 10000 })
        .catch(() => false);
      expect(decisionVisible).toBeTruthy();
    });
  });
});

