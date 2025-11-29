import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'admin@example.com';
const TEST_PASSWORD = 'admin123';
const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

test.describe('PS-MGA-001 — Inicio de sesión exitoso', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await page.goto(LOGIN_PATH);
    await page.waitForLoadState('domcontentloaded');
  });

  test('debería autenticar y redirigir al módulo asignado según el rol', async ({ page }) => {
    await test.step('Ingresar credenciales válidas', async () => {
      const emailInput = page.locator('input[type="email"], input#email').first();
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await emailInput.fill(TEST_EMAIL);

      const passwordInput = page.locator('input[type="password"], input#password').first();
      await expect(passwordInput).toBeVisible({ timeout: 10000 });
      await passwordInput.fill(TEST_PASSWORD);
    });

    await test.step('Enviar el formulario de inicio de sesión', async () => {
      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Entrar|Iniciar sesión|Ingresar/i }).first();
      await expect(submitButton).toBeVisible({ timeout: 10000 });
      await submitButton.click();
    });

    await test.step('Esperar la redirección al área protegida', async () => {
      await expect.poll(() => page.url(), { timeout: 20000 }).toContain('/marketplace-refactored');
      await page.waitForLoadState('networkidle', { timeout: 20000 });
    });

    await test.step('Validar la interfaz según el rol', async () => {
      const incidencesHeading = page.locator('h1', { hasText: /Gestión de Incidencias/i }).first();
      const publicationsHeading = page.locator('h1, h2').filter({ hasText: /Publicaciones|Marketplace/i }).first();

      const destination = await Promise.race([
        incidencesHeading.waitFor({ state: 'visible', timeout: 20000 }).then(() => 'incidences'),
        publicationsHeading.waitFor({ state: 'visible', timeout: 20000 }).then(() => 'publications'),
      ]).catch((error) => {
        throw new Error(`No se detectó un módulo conocido tras el inicio de sesión.\nURL actual: ${page.url()}\nDetalle: ${String(error)}`);
      });

      if (destination === 'incidences') {
        await expect(incidencesHeading).toBeVisible();
      } else {
        await expect(publicationsHeading).toBeVisible();
      }
    });

    await test.step('Verificar que la sesión activa tenga un token JWT válido', async () => {
      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token, 'El token de acceso no se almacenó en localStorage').toBeTruthy();

      const tokenSegments = token?.split('.') ?? [];
      expect(tokenSegments.length).toBeGreaterThanOrEqual(3);
      tokenSegments.forEach((segment) => expect(segment?.length).toBeGreaterThan(0));
    });
  });
});

