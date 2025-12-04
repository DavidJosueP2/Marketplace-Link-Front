import { test, expect } from '@playwright/test';

const TOKEN_STORAGE_KEY = 'mp_access_token';
const PROTECTED_ROUTES = [
  '/marketplace-refactored/publications',
  '/marketplace-refactored/incidencias',
];

test.describe('PS-MGA-006 — Acceso a ruta protegida sin JWT', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  for (const route of PROTECTED_ROUTES) {
    test(`debería bloquear la ruta protegida ${route} cuando no hay sesión`, async ({ page }) => {
      await test.step('Intentar abrir directamente la ruta protegida', async () => {
        await page.goto(route);
        await page.waitForLoadState('domcontentloaded');
      });

      await test.step('Verificar redirección del guard', async () => {
        await expect.poll(() => page.url(), { timeout: 15000 }).toContain('/login');

        const loginHeading = page.locator('h1', { hasText: /Bienvenido de vuelta/i }).first();
        await expect(loginHeading).toBeVisible({ timeout: 10000 });
      });

      await test.step('Confirmar que no se generó token', async () => {
        const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
        expect(token).toBeNull();
      });
    });
  }
});

