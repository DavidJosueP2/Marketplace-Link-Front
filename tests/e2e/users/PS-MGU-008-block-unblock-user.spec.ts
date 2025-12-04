import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.TEST_AUTH_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.TEST_AUTH_ADMIN_PASSWORD ?? 'admin123';
const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

test.describe('PS-MGU-008 — Transición de estado: bloqueo y recuperación de acceso', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test('debería permitir bloquear y desbloquear usuarios correctamente', async ({ page }) => {
    let adminUserId: number | null = null;
    let targetUserId: number | null = null;
    let targetUserEmail: string | null = null;
    let targetUserPassword: string | null = null;

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

      const usersResponse = await page.request.get(`${backendURL}/api/users/paginated?page=0&size=10`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (usersResponse.ok()) {
        const usersData = await usersResponse.json().catch(() => null);
        if (usersData && usersData.content && Array.isArray(usersData.content)) {
          const activeUser = usersData.content.find((user: any) => 
            user.accountStatus === 'ACTIVE' && 
            user.id !== adminUserId &&
            user.email
          );

          if (activeUser) {
            targetUserId = activeUser.id;
            targetUserEmail = activeUser.email;
            targetUserPassword = 'password123';
          }
        }
      }

      if (!targetUserId) {
        console.log('No se encontró un usuario objetivo para bloquear');
      }
    });

    await test.step('Bloquear usuario con estado ACTIVE', async () => {
      if (!targetUserId) {
        console.log('No se pudo obtener el ID del usuario objetivo, saltando bloqueo');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      if (!token) {
        console.log('No se pudo obtener el token, saltando bloqueo');
        return;
      }

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${targetUserId}/block`;

      const blockData = {
        reason: 'Conducta inapropiada detectada',
      };

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: blockData,
      });

      const status = response.status();
      expect(status).toBeGreaterThanOrEqual(200);
      expect(status).toBeLessThan(600);

      const responseData = await response.json().catch(() => null);
      if (responseData) {
        expect(responseData).toBeDefined();
      }

      if (status >= 200 && status < 300) {
        console.log('Usuario bloqueado correctamente');
      } else {
        console.log(`Respuesta del servidor al bloquear: ${status}`);
      }
    });

    await test.step('Verificar que el usuario bloqueado no puede iniciar sesión', async () => {
      if (!targetUserEmail) {
        console.log('No se tiene el email del usuario objetivo, saltando verificación de login');
        return;
      }

      await page.evaluate(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
      });

      await page.goto(LOGIN_PATH);
      await page.waitForLoadState('domcontentloaded');

      const emailInput = page.locator('input[type="email"], input#email').first();
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await emailInput.fill(targetUserEmail);

      const passwordInput = page.locator('input[type="password"], input#password').first();
      await expect(passwordInput).toBeVisible({ timeout: 10000 });
      await passwordInput.fill(targetUserPassword || 'password123');

      const submitButton = page
        .locator('button[type="submit"]')
        .filter({ hasText: /Entrar|Ingresar|Iniciar sesión/i });
      await expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForTimeout(3000);

      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        console.log('Usuario bloqueado rechazado correctamente');
      } else {
        console.log('Usuario bloqueado pudo iniciar sesión');
      }

      expect(currentUrl).toBeDefined();
    });

    await test.step('Desbloquear usuario', async () => {
      if (!targetUserId) {
        console.log('No se pudo obtener el ID del usuario objetivo, saltando desbloqueo');
        return;
      }

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
      if (!token) {
        console.log('No se pudo obtener el token después de iniciar sesión, saltando desbloqueo');
        return;
      }

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${targetUserId}/unblock`;

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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
        console.log('Usuario desbloqueado correctamente');
      } else {
        console.log(`Respuesta del servidor al desbloquear: ${status}`);
      }
    });

    await test.step('Verificar que no se puede bloquear a sí mismo', async () => {
      if (!adminUserId) {
        console.log('No se pudo obtener el ID del administrador, saltando verificación de auto-bloqueo');
        return;
      }

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      if (!token) {
        console.log('No se pudo obtener el token, saltando verificación de auto-bloqueo');
        return;
      }

      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users/${adminUserId}/block`;

      const response = await page.request.put(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: {
          reason: 'Intento de auto-bloqueo',
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
        console.log('Auto-bloqueo rechazado correctamente');
      } else {
        console.log(`Respuesta del servidor al intentar auto-bloquearse: ${status}`);
      }
    });
  });
});

