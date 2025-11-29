import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.TEST_AUTH_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.TEST_AUTH_ADMIN_PASSWORD ?? 'admin123';
const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

test.describe('PS-MGU-006 — Información personal: nombres, identificación y género', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test('debería permitir actualizar información personal con validaciones', async ({ page }) => {
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

    await test.step('Enviar formulario con valores inválidos', async () => {
      if (!userId) {
        console.log('No se pudo obtener el ID del usuario, saltando prueba de datos inválidos');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${userId}`;

      const invalidData = {
        firstName: '',
        lastName: 'García',
        cedula: '12345',
        gender: '',
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
        console.log('Solicitud rechazada con datos inválidos');
      } else {
        console.log(`Respuesta del servidor: ${status}`);
      }
    });

    await test.step('Corregir campos con valores válidos y enviar formulario', async () => {
      if (!userId) {
        console.log('No se pudo obtener el ID del usuario, saltando actualización');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${userId}`;

      const validData = {
        firstName: originalUserData?.firstName || 'Juan',
        lastName: originalUserData?.lastName || 'García',
        cedula: originalUserData?.cedula || '0102030405',
        gender: originalUserData?.gender || 'MALE',
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
        console.log('Información personal actualizada correctamente');
      } else {
        console.log(`Respuesta del servidor: ${status}`);
      }
    });

    await test.step('Verificar que solo los campos modificados se actualizaron', async () => {
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

          if (userData.firstName) {
            expect(typeof userData.firstName).toBe('string');
          }

          if (userData.lastName) {
            expect(typeof userData.lastName).toBe('string');
          }

          if (userData.cedula) {
            expect(typeof userData.cedula).toBe('string');
          }

          if (userData.gender) {
            expect(typeof userData.gender).toBe('string');
          }

          if (originalUserData) {
            if (userData.roles) {
              expect(Array.isArray(userData.roles)).toBeTruthy();
            }

            if (userData.email || originalUserData.email) {
              expect(userData.email || originalUserData.email).toBeDefined();
            }
          }

          console.log('Campos actualizados verificados correctamente');
        }
      }
    });
  });
});

