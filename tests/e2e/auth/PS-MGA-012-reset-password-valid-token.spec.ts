import { test, expect } from '@playwright/test';

const RESET_TOKEN = process.env.TEST_AUTH_RESET_TOKEN ?? 'e2a24461-bf2f-4a54-baa7-02af1dda3b11';
const USER_EMAIL = process.env.TEST_AUTH_RESET_EMAIL ?? 'prueba.cuenta.5212@gmail.com';
const NEW_PASSWORD = process.env.TEST_AUTH_RESET_NEW_PASSWORD ?? 'NuevaClaveSegura1234!';

test.describe('PS-MGA-012 — Reset de contraseña con token válido', () => {
  test('debería permitir restablecer la contraseña e iniciar sesión con la nueva credencial', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto(`/reset-password?token=${RESET_TOKEN}`);
    await page.waitForLoadState('domcontentloaded');

    await test.step('Ingresar la nueva contraseña y enviar el formulario', async () => {
      const passwordInput = page
        .locator('label:has-text("Nueva contraseña")')
        .locator('..')
        .locator('input[type="password"]')
        .first();
      const confirmInput = page
        .locator('label:has-text("Confirmar contraseña")')
        .locator('..')
        .locator('input[type="password"]')
        .first();

      await expect(passwordInput).toBeVisible({ timeout: 5000 });
      await expect(confirmInput).toBeVisible({ timeout: 5000 });

      await passwordInput.fill(NEW_PASSWORD);
      await confirmInput.fill(NEW_PASSWORD);

      const submitButton = page.getByRole('button', { name: /Actualizar contraseña/i });
      await expect(submitButton).toBeVisible();

      const responsePromise = page.waitForResponse((response) => {
        return response.url().includes('/api/auth/password/reset') && response.request().method() === 'POST';
      });

      await submitButton.click();

      const response = await responsePromise;
      const status = response.status();
      expect.soft([200, 204]).toContain(status);
    });

    await test.step('Verificar mensaje de confirmación', async () => {
      const successMessage = page.locator('text=/contraseña ha sido actualizada correctamente|Restablecimiento exitoso|Nueva contraseña guardada/i');
      await expect(successMessage).toBeVisible({ timeout: 10000 });
    });

    await test.step('Iniciar sesión con la nueva contraseña', async () => {
      await page.goto('/login');
      await page.waitForLoadState('domcontentloaded');

      const emailInput = page.locator('input[type="email"], input#email').first();
      const passwordInput = page.locator('input[type="password"], input#password').first();

      await expect(emailInput).toBeVisible({ timeout: 5000 });
      await expect(passwordInput).toBeVisible({ timeout: 5000 });

      await emailInput.fill(USER_EMAIL);
      await passwordInput.fill(NEW_PASSWORD);

      const loginButton = page.getByRole('button', { name: /Entrar|Ingresar|Iniciar sesión/i }).first();
      await expect(loginButton).toBeVisible();

      await loginButton.click();

      await expect.poll(() => page.url(), { timeout: 15000 }).toContain('/marketplace-refactored');
    });
  });
});

