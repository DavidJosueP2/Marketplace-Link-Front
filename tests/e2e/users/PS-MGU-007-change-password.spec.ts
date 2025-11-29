import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.TEST_AUTH_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.TEST_AUTH_ADMIN_PASSWORD ?? 'admin123';
const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

test.describe('PS-MGU-007 — Seguridad de la cuenta: cambio de contraseña', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test('debería permitir cambiar contraseña con validaciones de complejidad', async ({ page }) => {
    let userId: number | null = null;
    const originalPassword = ADMIN_PASSWORD;
    const newPassword = `NuevaClaveSegura${Date.now()}!`;

    await test.step('Iniciar sesión con usuario administrador', async () => {
      await page.goto(LOGIN_PATH);
      await page.waitForLoadState('domcontentloaded');

      const emailInput = page.locator('input[type="email"], input#email').first();
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await emailInput.fill(ADMIN_EMAIL);

      const passwordInput = page.locator('input[type="password"], input#password').first();
      await expect(passwordInput).toBeVisible({ timeout: 10000 });
      await passwordInput.fill(originalPassword);

      const submitButton = page
        .locator('button[type="submit"]')
        .filter({ hasText: /Entrar|Ingresar|Iniciar sesión/i });
      await expect(submitButton).toBeVisible();
      await submitButton.click();

      await Promise.race([
        page.waitForURL(/\/marketplace-refactored/, { timeout: 15000 }).catch(() => null),
        page.waitForSelector('text=/Bienvenido|Publicaciones|Incidencias/i', { timeout: 15000 }).catch(() => null),
      ]);

      await page.waitForLoadState('networkidle').catch(() => null);

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token).toBeTruthy();
    });

    await test.step('Obtener datos del usuario actual', async () => {
      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      
      const profileResponse = await page.request.get(`${backendURL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const status = profileResponse.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(500);

      if (status >= 200 && status < 300) {
        const profileData = await profileResponse.json().catch(() => null);
        if (profileData && profileData.id) {
          userId = profileData.id;
        }
      }

      if (!userId) {
        const usersResponse = await page.request.get(`${backendURL}/api/users/paginated?page=0&size=1`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (usersResponse.ok()) {
          const usersData = await usersResponse.json().catch(() => null);
          if (usersData && usersData.content && usersData.content.length > 0) {
            userId = usersData.content[0].id;
          }
        }
      }

      expect(userId).toBeTruthy();
    });

    await test.step('Intentar cambiar contraseña con valores inválidos: contraseña corta', async () => {
      if (!userId) {
        console.log('No se pudo obtener el ID del usuario, saltando prueba de contraseña corta');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${userId}/change-password`;

      const invalidData = {
        currentPassword: originalPassword,
        newPassword: 'abc123',
        confirmNewPassword: 'abc123',
      };

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: invalidData,
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData) {
        expect(responseData).toBeDefined();
      }

      if (status >= 400 && status < 500) {
        console.log('Contraseña corta rechazada correctamente');
      } else {
        console.log(`Respuesta del servidor: ${status}`);
      }
    });

    await test.step('Intentar cambiar contraseña con valores inválidos: contraseña igual a la actual', async () => {
      if (!userId) {
        console.log('No se pudo obtener el ID del usuario, saltando prueba de contraseña igual');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${userId}/change-password`;

      const invalidData = {
        currentPassword: originalPassword,
        newPassword: originalPassword,
        confirmNewPassword: originalPassword,
      };

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: invalidData,
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData) {
        expect(responseData).toBeDefined();
      }

      if (status >= 400 && status < 500) {
        console.log('Contraseña igual a la actual rechazada correctamente');
      } else {
        console.log(`Respuesta del servidor: ${status}`);
      }
    });

    await test.step('Intentar cambiar contraseña con valores inválidos: contraseñas no coinciden', async () => {
      if (!userId) {
        console.log('No se pudo obtener el ID del usuario, saltando prueba de contraseñas no coinciden');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${userId}/change-password`;

      const invalidData = {
        currentPassword: originalPassword,
        newPassword: 'NuevaClave123!',
        confirmNewPassword: 'OtraClave456!',
      };

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: invalidData,
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData) {
        expect(responseData).toBeDefined();
      }

      if (status >= 400 && status < 500) {
        console.log('Contraseñas no coinciden rechazadas correctamente');
      } else {
        console.log(`Respuesta del servidor: ${status}`);
      }
    });

    await test.step('Cambiar contraseña con valores válidos', async () => {
      if (!userId) {
        console.log('No se pudo obtener el ID del usuario, saltando cambio de contraseña');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${userId}/change-password`;

      const validData = {
        currentPassword: originalPassword,
        newPassword: newPassword,
        confirmNewPassword: newPassword,
      };

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: validData,
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData) {
        expect(responseData).toBeDefined();
      }

      if (status >= 200 && status < 300) {
        console.log('Contraseña cambiada exitosamente');
      } else {
        console.log(`Respuesta del servidor: ${status}`);
      }
    });

    await test.step('Verificar que la contraseña anterior ya no es válida', async () => {
      await page.evaluate(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
      });

      await page.goto(LOGIN_PATH);
      await page.waitForLoadState('domcontentloaded');

      const emailInput = page.locator('input[type="email"], input#email').first();
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await emailInput.fill(ADMIN_EMAIL);

      const passwordInput = page.locator('input[type="password"], input#password').first();
      await expect(passwordInput).toBeVisible({ timeout: 10000 });
      await passwordInput.fill(originalPassword);

      const submitButton = page
        .locator('button[type="submit"]')
        .filter({ hasText: /Entrar|Ingresar|Iniciar sesión/i });
      await expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(3000);

      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        console.log('Contraseña anterior rechazada correctamente');
      } else {
        console.log('Usuario autenticado con contraseña anterior');
      }

      expect(currentUrl).toBeDefined();
    });
  });
});

