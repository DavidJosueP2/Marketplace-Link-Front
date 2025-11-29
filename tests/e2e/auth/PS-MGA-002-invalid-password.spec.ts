import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'admin@example.com';
const INVALID_PASSWORD = 'incorrecta123';
const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

test.describe('PS-MGA-002 — Login con contraseña incorrecta', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await page.goto(LOGIN_PATH);
    await page.waitForLoadState('domcontentloaded');
  });

  test('debería mostrar un error genérico y evitar el acceso', async ({ page }) => {
    await test.step('Ingresar credenciales inválidas', async () => {
      const emailInput = page.locator('input[type="email"], input#email').first();
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await emailInput.fill(TEST_EMAIL);

      const passwordInput = page.locator('input[type="password"], input#password').first();
      await expect(passwordInput).toBeVisible({ timeout: 10000 });
      await passwordInput.fill(INVALID_PASSWORD);
    });

    await test.step('Intentar iniciar sesión', async () => {
      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Entrar|Iniciar sesión|Ingresar/i }).first();
      await expect(submitButton).toBeVisible({ timeout: 10000 });
      await submitButton.click();
    });

    await test.step('Validar mensaje de error y permanencia en login', async () => {
      const errorMessage = page
        .locator('form div')
        .filter({ hasText: /(Credenciales|Email).*(inválid|incorrect)/i })
        .first();
      await expect(errorMessage).toBeVisible({ timeout: 15000 });

      await expect.poll(() => page.url(), { timeout: 5000 }).toContain(LOGIN_PATH);
    });

    await test.step('Verificar que no se generó token', async () => {
      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token).toBeNull();
    });
  });
});

