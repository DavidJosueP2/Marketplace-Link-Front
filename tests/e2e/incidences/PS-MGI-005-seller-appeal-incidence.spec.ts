import { test, expect } from "@playwright/test";

const SELLER_EMAIL = "pruebasjos05@gmail.com";
const PASSWORD = "password123";
const INCIDENCE_ID = "99ac1bbf-2b1a-4f72-ab2f-1da5670d06c2";
const APPEAL_REASON =
  "Considero que la decisión tomada fue incorrecta ya que mi publicación cumple con todas las políticas del marketplace. La información proporcionada es veraz y el contenido es apropiado. Solicito una revisión detallada del caso.";

test.describe("PS-MGI-005 - Vendedor apela decisión de moderación", () => {
  test("vendedor puede apelar una decisión de moderación", async ({ page }) => {
    await test.step("Vendedor inicia sesión", async () => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      await page.locator('input[type="email"], input#email').fill(SELLER_EMAIL);
      await page
        .locator('input[type="password"], input#password')
        .fill(PASSWORD);
      await page
        .locator('button[type="submit"]')
        .filter({ hasText: /Entrar|Ingresar/i })
        .click();

      await page.waitForURL(/\/marketplace-refactored/, { timeout: 20000 });
    });

    await test.step("Vendedor navega a la página de apelación desde el enlace del correo", async () => {
      await page.goto(
        `/marketplace-refactored/incidencias/${INCIDENCE_ID}/apelacion`,
      );
      await page.waitForLoadState("networkidle");

      const appealTitle = page
        .locator("text=/Apelar Decisión de Moderación/i")
        .first();
      await expect(appealTitle).toBeVisible({ timeout: 10000 });
    });

    await test.step("Vendedor completa el formulario de apelación", async () => {
      const reasonTextarea = page.locator("textarea#appeal-reason");
      await expect(reasonTextarea).toBeVisible({ timeout: 10000 });
      await reasonTextarea.fill(APPEAL_REASON);

      const characterCount = page.locator("text=/\\d+\\/500/i").first();
      await expect(characterCount).toBeVisible({ timeout: 5000 });
    });

    await test.step("Vendedor envía la apelación", async () => {
      const submitButton = page
        .locator("button")
        .filter({ hasText: /Enviar Apelación/i })
        .first();

      await expect(submitButton).toBeEnabled({ timeout: 5000 });

      const appealResponsePromise = page.waitForResponse((response) => {
        return (
          response.url().includes("/api/incidences/appeal") &&
          response.request().method() === "POST"
        );
      });

      await submitButton.click({ timeout: 10000 });

      const appealResponse = await appealResponsePromise;
      const appealPayload = await appealResponse.json();

      expect(appealResponse.ok()).toBeTruthy();
      expect(appealPayload.message || appealPayload).toBeTruthy();

      await page.waitForURL(/\/marketplace-refactored/, { timeout: 20000 });
    });
  });
});
