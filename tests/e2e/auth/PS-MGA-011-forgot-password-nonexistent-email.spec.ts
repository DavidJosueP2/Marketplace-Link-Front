import { test, expect } from '@playwright/test';

const UNKNOWN_EMAIL = process.env.TEST_AUTH_FORGOT_UNKNOWN_EMAIL ?? 'correo.inexistente@example.com';

test.describe('PS-MGA-011 — “Olvidé mi contraseña” con correo inexistente (anti-enumeración)', () => {
  test('debería responder con mensaje genérico sin revelar existencia de cuenta', async ({ page }) => {
    await page.goto('/password-recovery');
    await page.waitForLoadState('domcontentloaded');

    await test.step('Enviar solicitud con correo inexistente', async () => {
      const emailInput = page.locator('input[type="email"], input#email');
      await expect(emailInput).toBeVisible({ timeout: 5000 });
      await emailInput.fill(UNKNOWN_EMAIL);

      const submitButton = page.getByRole('button', { name: /Enviar enlace|Enviar|Recuperar|Continuar/i });
      await expect(submitButton).toBeVisible();

      const requestPromise = page.waitForResponse((response) => {
        return response.url().includes('/api/auth/password/forgot') && response.request().method() === 'POST';
      });

      await submitButton.click();

      const response = await requestPromise;
      expect([200, 204, 404]).toContain(response.status());
    });

    await test.step('Mostrar el mismo mensaje genérico de confirmación', async () => {
      const confirmationMessage = page
        .locator('div[role="alert"], p, span')
        .filter({ hasText: /(correo|enlace).*restablecer|Si el correo existe/i })
        .first();
      await expect(confirmationMessage).toBeVisible({ timeout: 10000 });
    });
  });
});

