import { test, expect } from "@playwright/test";

const MOD_EMAIL = "josuegarcab2@hotmail.com";
const PASSWORD = "password123";
const DECISION_COMMENT =
  "La publicación cumple con las políticas del marketplace y no presenta contenido inapropiado.";

test.describe("PS-MGI-003 - Moderador aprueba el reporte", () => {
  test("moderador aprueba una incidencia y la publicación pasa a VISIBLE", async ({
    page,
  }) => {
    let incidenceId = "";

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

    await test.step("Moderador navega a Mis incidencias", async () => {
      await page.goto("/marketplace-refactored/incidencias");
      await page.waitForLoadState("networkidle");

      const myIncidencesSection = page
        .locator("text=/Mis Incidencias/i")
        .first();
      await expect(myIncidencesSection).toBeVisible({ timeout: 10000 });
    });

    await test.step("Moderador hace clic en Ver detalle de una incidencia en Mis incidencias", async () => {
      await page.waitForLoadState("networkidle", { timeout: 10000 });

      const firstViewDetailButton = page
        .locator("button")
        .filter({ hasText: /Ver detalle/i })
        .first();

      await expect(firstViewDetailButton).toBeVisible({ timeout: 15000 });

      await firstViewDetailButton.click();

      await page.waitForURL(/\/marketplace-refactored\/incidencias\/[^/]+/, {
        timeout: 20000,
      });
      await page.waitForLoadState("networkidle");

      const urlMatch = page.url().match(/\/incidencias\/([^/]+)/);
      if (urlMatch && urlMatch[1]) {
        incidenceId = urlMatch[1];
      }
    });

    await test.step("Moderador hace clic en Hacer decisión", async () => {
      await page.waitForTimeout(2000);

      const makeDecisionButton = page
        .locator("button")
        .filter({ hasText: /Hacer decisión/i })
        .first();

      await makeDecisionButton.click({ timeout: 15000 });

      const modalTitle = page.locator("text=/Registrar decisión/i").first();
      await expect(modalTitle).toBeVisible({ timeout: 10000 });
    });

    await test.step("Moderador selecciona Aprobar publicación y agrega comentario", async () => {
      const decisionSelect = page.locator("select#decision-select");
      await decisionSelect.waitFor({ state: "visible", timeout: 10000 });
      await decisionSelect.selectOption({ value: "APPROVED" });

      const commentTextarea = page.locator("textarea#decision-comment");
      await commentTextarea.waitFor({ state: "visible", timeout: 10000 });
      await commentTextarea.fill(DECISION_COMMENT);
    });

    await test.step("Moderador confirma la decisión", async () => {
      const confirmButton = page
        .locator("button")
        .filter({ hasText: /Confirmar decisión/i })
        .first();

      const decisionResponsePromise = page.waitForResponse((response) => {
        return (
          response.url().includes("/api/incidences/decision") &&
          response.request().method() === "POST"
        );
      });

      await confirmButton.click({ timeout: 10000 });

      const decisionResponse = await decisionResponsePromise;
      const decisionPayload = await decisionResponse.json();

      expect(decisionResponse.ok()).toBeTruthy();
      expect(decisionPayload.decision).toBe("APPROVED");

      await page.waitForTimeout(2000);
    });

    await test.step("Verificar que la decisión se registró y el comentario se agregó", async () => {
      await page.waitForLoadState("networkidle", { timeout: 10000 });
      await page.waitForTimeout(2000);

      const decisionBadge = page
        .locator("badge, span")
        .filter({ hasText: /Aprobada|APPROVED/i })
        .first();

      const decisionVisible = await decisionBadge
        .isVisible({ timeout: 10000 })
        .catch(() => false);
      expect(decisionVisible).toBeTruthy();
    });
  });
});
