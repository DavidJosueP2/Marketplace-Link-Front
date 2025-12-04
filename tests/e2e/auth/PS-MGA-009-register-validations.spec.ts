import { test, expect } from '@playwright/test';

const BASE_URL = process.env.VITE_FRONTEND_URL || 'http://localhost:5174';

test.describe('PS-MGA-009 — Registro: validaciones de campos (negativo)', () => {
  test('debería mostrar mensajes de error y bloquear el avance hasta corregirlos', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');

    await test.step('Paso Cuenta: impedir avance con campos vacíos', async () => {
      const nextButton = page.getByRole('button', { name: 'Siguiente' });
      await nextButton.click();

      await expect(page.locator('input[name="username"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();

      await expect(page.locator('p', { hasText: 'Mínimo 3 caracteres.' })).toBeVisible();
      await expect(page.locator('p', { hasText: 'Requerido.' }).nth(0)).toBeVisible();
      await expect(page.locator('p', { hasText: 'Confirma tu contraseña.' })).toBeVisible();

      const phoneError = page
        .locator('label:has-text("Teléfono")')
        .locator('..')
        .locator('p', { hasText: /(Requerido|Debe tener 9 dígitos)/ });
      await expect(phoneError).toBeVisible();
    });

    await test.step('Paso Cuenta: completar datos válidos y avanzar', async () => {
      const timestamp = Date.now();
      await page.locator('input[name="username"]').fill(`testuser${timestamp}`);
      await page.locator('input[name="email"]').fill(`registro${timestamp}@example.com`);
      await page.locator('input#password').fill('P@ssw0rd!');
      await page.locator('input#confirmPassword').fill('P@ssw0rd!');
      await page.locator('input[name="phone"]').fill('998123456');

      await page.getByRole('button', { name: 'Siguiente' }).click();
      await expect(page.locator('input[name="firstName"]')).toBeVisible({ timeout: 5000 });
    });

    await test.step('Paso Perfil: impedir avance con campos incompletos', async () => {
      await page.getByRole('button', { name: 'Siguiente' }).click();

      await expect(page.locator('input[name="firstName"]')).toBeVisible();

      await expect(page.locator('p', { hasText: 'Requerido.' }).nth(0)).toBeVisible();
      await expect(page.locator('p', { hasText: 'Requerido.' }).nth(1)).toBeVisible();

      const cedulaError = page
        .locator('label:has-text("Cédula")')
        .locator('..')
        .locator('p', { hasText: /(Requerido|10 dígitos\.)/ });
      await expect(cedulaError).toBeVisible();
      await expect(page.locator('p', { hasText: 'Selecciona tu género.' })).toBeVisible();
    });

    await test.step('Paso Perfil: completar datos válidos y avanzar', async () => {
      await page.locator('input[name="firstName"]').fill('Juan');
      await page.locator('input[name="lastName"]').fill('Paredes');
      await page.locator('input[name="cedula"]').fill('1710034065');

      await page.getByRole('button', { name: /Selecciona tu género|Masculino/i }).first().click();
      await page.getByRole('option', { name: 'Masculino', exact: true }).click();

      await page.getByRole('button', { name: 'Siguiente' }).click();
      await expect(page.getByRole('button', { name: /Compartir ubicación|Obteniendo…/i })).toBeVisible({ timeout: 5000 });
    });

    await test.step('Paso Ubicación: impedir registro sin compartir ubicación', async () => {
      const registerButton = page.getByRole('button', { name: /Registrarme|Creando cuenta…/i });
      await expect(registerButton).toBeVisible();
      await registerButton.click();

      const locationCard = page.locator('div').filter({ hasText: 'Ubicación' }).first();
      await expect(locationCard.locator('p', { hasText: 'Ubicación obligatoria.' })).toBeVisible({ timeout: 5000 });

      await expect.poll(() => page.url(), { timeout: 2000 }).toContain('/register');
    });
  });
});

