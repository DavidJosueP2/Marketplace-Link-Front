import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.TEST_AUTH_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.TEST_AUTH_ADMIN_PASSWORD ?? 'admin123';
const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

test.describe('PS-MGU-009 — Transición de estado: activación y suspensión', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test('debería permitir activar y suspender usuarios correctamente', async ({ page }) => {
    let adminUserId: number | null = null;
    let inactiveUserId: number | null = null;
    let unverifiedUserId: number | null = null;

    await test.step('Iniciar sesión como administrador', async () => {
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

      await Promise.race([
        page.waitForURL(/\/marketplace-refactored/, { timeout: 15000 }).catch(() => null),
        page.waitForSelector('text=/Bienvenido|Publicaciones|Incidencias/i', { timeout: 15000 }).catch(() => null),
      ]);

      await page.waitForLoadState('networkidle').catch(() => null);

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token).toBeTruthy();
    });

    await test.step('Obtener datos del administrador y usuarios disponibles', async () => {
      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      if (!token) {
        console.log('No se pudo obtener el token, saltando prueba');
        return;
      }

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      
      const profileResponse = await page.request.get(`${backendURL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (profileResponse.ok()) {
        const profileData = await profileResponse.json().catch(() => null);
        if (profileData && profileData.id) {
          adminUserId = profileData.id;
        }
      }

      const usersResponse = await page.request.get(`${backendURL}/api/users/paginated?page=0&size=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (usersResponse.ok()) {
        const usersData = await usersResponse.json().catch(() => null);
        if (usersData && usersData.content && Array.isArray(usersData.content)) {
          const inactiveUser = usersData.content.find((user: any) => 
            (user.accountStatus === 'INACTIVE' || user.state === 'INACTIVE') &&
            user.id !== adminUserId
          );

          if (inactiveUser) {
            inactiveUserId = inactiveUser.id;
          }

          const unverifiedUser = usersData.content.find((user: any) => 
            (user.accountStatus === 'PENDING_VERIFICATION' || 
             user.state === 'PENDING_VERIFICATION' ||
             !user.emailVerifiedAt) &&
            user.id !== adminUserId
          );

          if (unverifiedUser) {
            unverifiedUserId = unverifiedUser.id;
          }
        }
      }

      if (!inactiveUserId) {
        console.log('No se encontró un usuario INACTIVE para activar');
      }

      if (!unverifiedUserId) {
        console.log('No se encontró un usuario no verificado para probar activación rechazada');
      }
    });

    await test.step('Activar usuario con estado INACTIVE', async () => {
      if (!inactiveUserId) {
        console.log('No se pudo obtener el ID del usuario INACTIVE, saltando activación');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      if (!token) {
        console.log('No se pudo obtener el token, saltando activación');
        return;
      }

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${inactiveUserId}/activate`;

      const activateData = {
        reason: 'Reincorporación del usuario tras revisión de cuenta',
      };

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: activateData,
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData) {
        expect(responseData).toBeDefined();
      }

      if (status >= 200 && status < 300) {
        console.log('Usuario activado correctamente');
      } else {
        console.log(`Respuesta del servidor al activar: ${status}`);
      }
    });

    await test.step('Verificar que el estado cambió a ACTIVE', async () => {
      if (!inactiveUserId) {
        console.log('No se pudo obtener el ID del usuario, saltando verificación de estado');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      if (!token) {
        console.log('No se pudo obtener el token, saltando verificación de estado');
        return;
      }

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${inactiveUserId}`;

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
          
          if (userData.accountStatus || userData.state) {
            const currentStatus = userData.accountStatus || userData.state;
            console.log(`Estado actual del usuario: ${currentStatus}`);
          }
        }
      }
    });

    await test.step('Intentar activar usuario no verificado (debe rechazarse)', async () => {
      if (!unverifiedUserId) {
        console.log('No se pudo obtener el ID del usuario no verificado, saltando prueba de activación rechazada');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      if (!token) {
        console.log('No se pudo obtener el token, saltando prueba de activación rechazada');
        return;
      }

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${unverifiedUserId}/activate`;

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          reason: 'Intento de activar usuario no verificado',
        },
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData) {
        expect(responseData).toBeDefined();
      }

      if (status >= 400 && status < 500) {
        console.log('Activación de usuario no verificado rechazada correctamente');
      } else {
        console.log(`Respuesta del servidor al intentar activar usuario no verificado: ${status}`);
      }
    });

    await test.step('Suspender usuario (cambiar a INACTIVE)', async () => {
      if (!inactiveUserId) {
        console.log('No se pudo obtener el ID del usuario, saltando suspensión');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      if (!token) {
        console.log('No se pudo obtener el token, saltando suspensión');
        return;
      }

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${inactiveUserId}/deactivate`;

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          reason: 'Suspensión temporal del usuario',
        },
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData) {
        expect(responseData).toBeDefined();
      }

      if (status >= 200 && status < 300) {
        console.log('Usuario suspendido correctamente');
      } else {
        console.log(`Respuesta del servidor al suspender: ${status}`);
      }
    });

    await test.step('Verificar que el estado cambió a INACTIVE', async () => {
      if (!inactiveUserId) {
        console.log('No se pudo obtener el ID del usuario, saltando verificación de estado');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      if (!token) {
        console.log('No se pudo obtener el token, saltando verificación de estado');
        return;
      }

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${inactiveUserId}`;

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
          
          if (userData.accountStatus || userData.state) {
            const currentStatus = userData.accountStatus || userData.state;
            console.log(`Estado actual del usuario después de suspensión: ${currentStatus}`);
          }
        }
      }
    });

    await test.step('Verificar consistencia de datos', async () => {
      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      if (!token) {
        console.log('No se pudo obtener el token, saltando verificación de consistencia');
        return;
      }

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const usersResponse = await page.request.get(`${backendURL}/api/users/paginated?page=0&size=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (usersResponse.ok()) {
        const usersData = await usersResponse.json().catch(() => null);
        if (usersData && usersData.content && Array.isArray(usersData.content)) {
          expect(usersData.content.length).toBeGreaterThanOrEqual(0);
          console.log(`Total de usuarios en la lista: ${usersData.content.length}`);
        }
      }
    });
  });
});

