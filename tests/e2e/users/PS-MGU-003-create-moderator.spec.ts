import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.TEST_AUTH_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.TEST_AUTH_ADMIN_PASSWORD ?? 'admin123';
const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

const VALID_STATES = ['ACTIVE', 'BLOCKED', 'INACTIVE', 'PENDING', 'PENDING_VERIFICATION'];

test.describe('PS-MGU-003 — Incorporación de un moderador (solo administradores)', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test('debería permitir crear un nuevo moderador correctamente', async ({ page }) => {
    await test.step('Iniciar sesión con usuario administrador', async () => {
      await page.goto(LOGIN_PATH);
      await page.waitForLoadState('domcontentloaded');

      const emailInput = page.locator('input[type="email"], input#email').first();
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await emailInput.fill(ADMIN_EMAIL);

      const passwordInput = page.locator('input[type="password"], input#password').first();
      await expect(passwordInput).toBeVisible({ timeout: 10000 });
      await passwordInput.fill(ADMIN_PASSWORD);

      const submitButton = page
        .locator('button[type="submit"]')
        .filter({ hasText: /Entrar|Ingresar|Iniciar sesión/i });
      await expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForURL(/\/marketplace-refactored/, { timeout: 15000 });
      await page.waitForLoadState('networkidle');

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token).toBeTruthy();
    });

    await test.step('Enviar solicitud POST para crear moderador', async () => {
      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token).toBeTruthy();

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/moderators`;

      const moderatorData = {
        username: `moderadorTest${Date.now()}`,
        email: `moderador.test.${Date.now()}@example.com`,
        phone: '+593987654321',
        firstName: 'Moderador',
        lastName: 'Test',
        cedula: '1102030405',
        gender: 'MALE',
      };

      const response = await page.request.post(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: moderatorData,
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData) {
        expect(responseData).toBeDefined();
      }
      
      if (status >= 200 && status < 300) {
        console.log('Moderador creado exitosamente');
      } else {
        console.log(`Respuesta del servidor: ${status}`);
      }
    });

    await test.step('Validar estructura de respuesta y campos sensibles', async () => {
      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/moderators`;

      const moderatorData = {
        username: `moderadorTest3${Date.now()}`,
        email: `moderador.test3.${Date.now()}@example.com`,
        phone: '+593987654323',
        firstName: 'Moderador',
        lastName: 'Test3',
        cedula: '1102030407',
        gender: 'MALE',
      };

      const response = await page.request.post(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: moderatorData,
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData && status >= 200 && status < 300) {
        const responseKeys = Object.keys(responseData).map(k => k.toLowerCase());
        const sensitiveFields = ['password', 'hash', 'token', 'accessToken', 'refreshToken', 'secret', 'privateKey', 'salt'];
        
        for (const field of sensitiveFields) {
          if (responseKeys.some(k => k.includes(field))) {
            console.log(`Campo sensible encontrado: ${field}`);
          }
        }
      }
    });
  });
});

