import { test, expect } from '@playwright/test';

const USER_EMAIL = process.env.TEST_AUTH_LOGOUT_EMAIL ?? 'admin@example.com';
const USER_PASSWORD = process.env.TEST_AUTH_LOGOUT_PASSWORD ?? 'admin123';
const TOKEN_STORAGE_KEY = 'mp_access_token';

test.describe('PS-MGA-014 — Logout / Invalidación de sesión', () => {
  test('debería eliminar el token y bloquear el acceso a rutas protegidas', async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');

    await test.step('Iniciar sesión con credenciales válidas', async () => {
      const emailInput = page.locator('input[type="email"], input#email').first();
      const passwordInput = page.locator('input[type="password"], input#password').first();

      await expect(emailInput).toBeVisible({ timeout: 5000 });
      await expect(passwordInput).toBeVisible({ timeout: 5000 });

      await emailInput.fill(USER_EMAIL);
      await passwordInput.fill(USER_PASSWORD);

      const submitButton = page.getByRole('button', { name: /Entrar|Ingresar|Iniciar sesión/i }).first();
      await expect(submitButton).toBeVisible();
      await submitButton.click();

      await expect.poll(() => page.url(), { timeout: 15000 }).toContain('/marketplace-refactored');
    });

    await test.step('Cerrar sesión desde el menú', async () => {
      const directLogout = page.getByRole('button', { name: /Cerrar sesión|Salir/i }).first();
      if (await directLogout.isVisible()) {
        await directLogout.click();
      } else {
        const userInitial = (USER_EMAIL.trim().charAt(0) || 'U').toUpperCase();
        const userMenuButton = page.locator(`button:has(span:text-is("${userInitial}"))`).first();
        await expect(userMenuButton).toBeVisible({ timeout: 5000 });
        await userMenuButton.click();

        const logoutButton = page.locator('button', { hasText: /Cerrar sesión|Salir/i }).first();
        await expect(logoutButton).toBeVisible({ timeout: 5000 });
        await logoutButton.click();
      }

      await expect.poll(() => page.url(), { timeout: 10000 }).toContain('/login');
    });

    await test.step('Validar que el token se eliminó del almacenamiento', async () => {
      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token).toBeNull();
    });

    await test.step('Intentar acceder a una ruta protegida y verificar redirección', async () => {
      await page.goto('/marketplace-refactored/publications');
      await expect.poll(() => page.url(), { timeout: 10000 }).toContain('/login');

      const loginHeading = page.locator('h1', { hasText: /Bienvenido de vuelta/i }).first();
      await expect(loginHeading).toBeVisible({ timeout: 5000 });
    });
  });
});
