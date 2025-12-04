import { test, expect } from "@playwright/test";

const MOD_EMAIL = "josuegarcab2@hotmail.com";
const PASSWORD = "password123";

test.describe("PS-MGI-002 - Moderador toma la incidencia", () => {
  test("moderador puede tomar una incidencia pendiente y aparece en Mis incidencias", async ({
    page,
  }) => {
    let claimedIncidenceId = "";

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

    await test.step("Moderador navega al panel de incidencias", async () => {
      await page.goto("/marketplace-refactored/incidencias");
      await page.waitForLoadState("networkidle");

      const pendingSection = page
        .locator("text=/Incidencias Pendientes/i")
        .first();
      await expect(pendingSection).toBeVisible({ timeout: 10000 });
    });

    await test.step("Moderador hace clic en Ver detalle de la primera incidencia pendiente", async () => {
      await page.waitForLoadState("networkidle", { timeout: 10000 });

      const firstViewDetailButton = page
        .locator("button")
        .filter({ hasText: /Ver detalle/i })
        .first();

      await expect(firstViewDetailButton).toBeVisible({ timeout: 15000 });

      const firstRow = page.locator("table tr").nth(1);
      const firstCell = firstRow.locator("td").first();
      const incidenceIdText = await firstCell.textContent();

      if (incidenceIdText) {
        claimedIncidenceId = incidenceIdText.trim();
      }

      await firstViewDetailButton.click();

      await page.waitForURL(/\/marketplace-refactored\/incidencias\/[^/]+/, {
        timeout: 20000,
      });
      await page.waitForLoadState("networkidle");

      const urlMatch = page.url().match(/\/incidencias\/([^/]+)/);
      if (urlMatch && urlMatch[1]) {
        claimedIncidenceId = `#${urlMatch[1].substring(0, 8)}`;
      }
    });

    await test.step("Moderador hace clic en Atender incidencia", async () => {
      const claimButton = page
        .locator("button")
        .filter({ hasText: /Atender incidencia/i })
        .first();

      await expect(claimButton).toBeVisible({ timeout: 10000 });

      const claimResponsePromise = page.waitForResponse((response) => {
        return (
          response.url().includes("/api/incidences/claim") &&
          response.request().method() === "POST"
        );
      });

      await claimButton.click();

      const claimResponse = await claimResponsePromise;
      expect(claimResponse.ok()).toBeTruthy();

      await page.waitForURL(/\/marketplace-refactored\/incidencias$/, {
        timeout: 20000,
      });
      await page.waitForLoadState("networkidle");
    });

    await test.step("Moderador verifica que la incidencia aparece en Mis incidencias", async () => {
      await page.waitForLoadState("networkidle", { timeout: 10000 });

      const myIncidencesSection = page
        .locator("text=/Mis Incidencias/i")
        .first();
      await expect(myIncidencesSection).toBeVisible({ timeout: 10000 });

      if (claimedIncidenceId) {
        const allTables = page.locator("table");
        const tableCount = await allTables.count();

        let found = false;
        for (let i = 0; i < tableCount; i++) {
          const table = allTables.nth(i);
          const row = table.locator("tr", {
            has: page.locator(`text=/${claimedIncidenceId.replace("#", "\\#")}/i`),
          });

          if ((await row.count()) > 0) {
            await expect(row.first()).toBeVisible({ timeout: 5000 });
            found = true;
            break;
          }
        }

        expect(found).toBeTruthy();
      } else {
        const myIncidencesTable = page
          .locator("text=/Mis Incidencias/i")
          .locator("..")
          .locator("table")
          .first();
        await expect(myIncidencesTable).toBeVisible({ timeout: 10000 });
      }
    });
  });
});

