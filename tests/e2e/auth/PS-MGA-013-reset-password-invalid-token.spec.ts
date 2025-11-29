import { test, expect } from '@playwright/test';

const INVALID_TOKEN = process.env.TEST_AUTH_RESET_TOKEN ?? 'e2a24461-bf2f-4a54-baa7-02af1dda3b11';
const WEAK_PASSWORD = '12345';
const WEAK_CONFIRM = '54321';
const STRONG_PASSWORD = process.env.TEST_AUTH_RESET_INVALID_NEW_PASSWORD ?? 'ClaveNuevaSegura123!';

test.describe('PS-MGA-013 — Reset de contraseña: token expirado/inválido + validaciones UI', () => {
  test('debería mostrar validaciones en UI y rechazar token inválido', async ({ page }) => {
    await page.goto(`/reset-password?token=${INVALID_TOKEN}`);
    await page.waitForLoadState('domcontentloaded');

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
    const submitButton = page.getByRole('button', { name: /Actualizar contraseña/i });

    await test.step('Mostrar errores cuando las contraseñas no cumplen los criterios', async () => {
      await passwordInput.fill(WEAK_PASSWORD);
      await confirmInput.fill(WEAK_CONFIRM);
      await submitButton.click();

      const lengthError = page.locator('text=/Mínimo 8 caracteres/i').first();
      const mismatchError = page.locator('text=/Las contraseñas no coinciden/i').first();

      await expect(lengthError).toBeVisible({ timeout: 5000 });
      await expect(mismatchError).toBeVisible({ timeout: 5000 });
    });

    await test.step('Enviar contraseñas válidas y recibir error del backend por token inválido', async () => {
      await passwordInput.fill(STRONG_PASSWORD);
      await confirmInput.fill(STRONG_PASSWORD);

      const responsePromise = page.waitForResponse((response) => {
        return response.url().includes('/api/auth/password/reset') && response.request().method() === 'POST';
      });

      await submitButton.click();

      const response = await responsePromise;
      const status = response.status();
      expect.soft([400, 401, 403, 404]).toContain(status);

      const feedback = page.locator('text=/token|expir/i');
      await expect(feedback).toBeVisible({ timeout: 10000 });

      await expect(page).toHaveURL(new RegExp(`/reset-password\\?token=${INVALID_TOKEN}`));
    });
  });
});

