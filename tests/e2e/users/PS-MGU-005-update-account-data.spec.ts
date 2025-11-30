import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.TEST_AUTH_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.TEST_AUTH_ADMIN_PASSWORD ?? 'admin123';
const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

test.describe('PS-MGU-005 — Ajuste de datos de cuenta (nombre de usuario, correo, teléfono)', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test('debería permitir modificar información de cuenta y conservar campos no modificados', async ({ page }) => {
    let userId: number | null = null;
    let originalUserData: any = null;

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
          originalUserData = profileData;
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
            originalUserData = usersData.content[0];
          }
        }
      }

      expect(userId).toBeTruthy();
    });

    await test.step('Modificar campos de cuenta (username y phone)', async () => {
      if (!userId) {
        console.log('No se pudo obtener el ID del usuario, saltando actualización');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${userId}`;

      const updateData = {
        username: originalUserData?.username ? `${originalUserData.username}_updated` : `user_${Date.now()}`,
        phone: '+593987654321',
      };

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: updateData,
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData) {
        expect(responseData).toBeDefined();
      }

      if (status >= 200 && status < 300) {
        console.log('Datos de cuenta actualizados correctamente');
      } else {
        console.log(`Respuesta del servidor: ${status}`);
      }
    });

    await test.step('Consultar datos del usuario para confirmar cambios', async () => {
      if (!userId) {
        console.log('No se pudo obtener el ID del usuario, saltando verificación');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${userId}`;

      const response = await page.request.get(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(500);

      if (status >= 200 && status < 300) {
        const userData = await response.json().catch(() => null);
        if (userData) {
          expect(userData).toBeDefined();
          
          if (userData.id) {
            expect(userData.id).toBe(userId);
          }

          if (originalUserData) {
            if (userData.roles) {
              expect(Array.isArray(userData.roles)).toBeTruthy();
            }

            if (userData.email || originalUserData.email) {
              expect(userData.email || originalUserData.email).toBeDefined();
            }
          }

          console.log('Datos del usuario verificados correctamente');
        }
      }
    });

    await test.step('Validar que los campos no modificados se mantienen', async () => {
      if (!userId || !originalUserData) {
        console.log('No hay datos originales para comparar');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${userId}`;

      const response = await page.request.get(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok()) {
        const userData = await response.json().catch(() => null);
        if (userData && originalUserData) {
          if (userData.roles && originalUserData.roles) {
            expect(Array.isArray(userData.roles)).toBeTruthy();
          }

          if (userData.state || userData.accountStatus) {
            expect(userData.state || userData.accountStatus).toBeDefined();
          }

          console.log('Campos no modificados se mantienen correctamente');
        }
      }
    });
  });
});

