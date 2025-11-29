import { test, expect } from '@playwright/test';

const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

test.describe('PS-MGA-003 — Login con campos vacíos o faltantes', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await page.goto(LOGIN_PATH);
    await page.waitForLoadState('domcontentloaded');
  });

  test('debería impedir el envío y mostrar validaciones', async ({ page }) => {
    await test.step('Dejar los campos vacíos e intentar enviar', async () => {
      const emailInput = page.locator('input[type="email"], input#email').first();
      const passwordInput = page.locator('input[type="password"], input#password').first();
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await expect(passwordInput).toBeVisible({ timeout: 10000 });

      await emailInput.click();
      await emailInput.fill('');
      await passwordInput.click();
      await passwordInput.fill('');

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Entrar|Iniciar sesión|Ingresar/i }).first();
      await expect(submitButton).toBeVisible({ timeout: 10000 });
      await submitButton.click();
    });

    await test.step('Validar mensajes de error nativos y permanencia en login', async () => {
      const emailField = page.locator('input[type="email"], input#email').first();
      const passwordField = page.locator('input[type="password"], input#password').first();

      await expect(emailField).toBeVisible();
      await expect(passwordField).toBeVisible();

      const { formValid, emailMessage, passwordMessage } = await page.evaluate(() => {
        const form = document.querySelector('form');
        const emailInput = form?.querySelector<HTMLInputElement>('input[type="email"], input#email');
        const passwordInput = form?.querySelector<HTMLInputElement>('input[type="password"], input#password');

        return {
          formValid: form?.checkValidity() ?? true,
          emailMessage: emailInput?.validationMessage ?? '',
          passwordMessage: passwordInput?.validationMessage ?? '',
        };
      });

      expect(formValid).toBeFalsy();
      expect(emailMessage).toMatch(/fill out this field|requerid|required/i);
      expect(passwordMessage).toMatch(/fill out this field|requerid|required/i);

      await expect.poll(() => page.url(), { timeout: 3000 }).toContain(LOGIN_PATH);
    });

    await test.step('Verificar que no se generó token', async () => {
      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token).toBeNull();
    });
  });
});

