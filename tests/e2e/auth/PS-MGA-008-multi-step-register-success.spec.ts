import { test, expect } from '@playwright/test';

const BASE_URL = process.env.VITE_FRONTEND_URL || 'http://localhost:5174';
const TOKEN_STORAGE_KEY = 'mp_access_token';

test.describe('PS-MGA-008 — Registro multi-paso exitoso', () => {
  test('debería completar el registro en los tres pasos y redirigir al login', async ({ page, context }) => {
    const timestamp = Date.now();
    const uniqueUsername = `juanp${timestamp}`;
    const uniqueEmail = `prueba.cuenta.5212@gmail.com`;
    const password = 'P@ssw0rd!';
    const cedula = '1850191253';

    await context.grantPermissions(['geolocation'], { origin: BASE_URL });
    await context.setGeolocation({ latitude: -1.241657, longitude: -78.628837 });

    await page.goto('/register');
    await page.waitForLoadState('domcontentloaded');

    await test.step('Completar el paso Cuenta', async () => {
      await page.locator('input[name="username"]').fill(uniqueUsername);
      await page.locator('input[name="email"]').fill(uniqueEmail);
      await page.locator('input#password').fill(password);
      await page.locator('input#confirmPassword').fill(password);
      await page.locator('input[name="phone"]').fill('998123456');

      const nextButton = page.getByRole('button', { name: 'Siguiente' });
      await nextButton.click();

      await expect(page.locator('input[name="firstName"]')).toBeVisible({ timeout: 5000 });
    });

    await test.step('Completar el paso Perfil', async () => {
      await page.locator('input[name="firstName"]').fill('Juan');
      await page.locator('input[name="lastName"]').fill('Paredes');
      await page.locator('input[name="cedula"]').fill(cedula);

      await page.getByRole('button', { name: /Selecciona tu género|Masculino/i }).first().click();
      await page.getByRole('option', { name: 'Masculino', exact: true }).click();

      await page.getByRole('button', { name: /Selecciona tu rol|Comprador/i }).first().click();
      await page.getByRole('option', { name: 'Comprador', exact: true }).click();

      const nextButton = page.getByRole('button', { name: 'Siguiente' });
      await nextButton.click();

      await expect(page.getByRole('button', { name: /Compartir ubicación|Obteniendo…/i })).toBeVisible({ timeout: 5000 });
    });

    await test.step('Conceder la ubicación en el paso Ubicación', async () => {
      const shareButton = page.getByRole('button', { name: /Compartir ubicación|Obteniendo…/i });
      await shareButton.click();

      const grantedBadge = page.locator('div', { hasText: 'Ubicación' }).locator('span', { hasText: '✓' }).first();
      await expect(grantedBadge).toBeVisible({ timeout: 10000 });
    });

    await test.step('Enviar el formulario y validar respuesta', async () => {
      const registerResponsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/users') && response.request().method() === 'POST',
      );

      await page.getByRole('button', { name: /Registrarme|Creando cuenta…/i }).click();

      const registerResponse = await registerResponsePromise;

      if (!registerResponse.ok()) {
        const debug = await registerResponse.json().catch(() => null);
        test.fail(true, `Respuesta inesperada del registro: ${registerResponse.status()} ${JSON.stringify(debug)}`);
      }

      await page.waitForURL(/\/login\?registered=1/i, { timeout: 20000 });
      await expect(page.getByRole('heading', { name: /Bienvenido de vuelta/i })).toBeVisible({ timeout: 10000 });

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token).toBeNull();
    });
  });
});

