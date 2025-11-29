import { test, expect } from '@playwright/test';

const TOKEN_STORAGE_KEY = 'mp_access_token';

interface ProtectedScenario {
  label: string;
  email: string;
  password: string;
  targetPath: string;
  assertContent: (page: import('@playwright/test').Page) => Promise<void>;
}

const staffScenario: ProtectedScenario = {
  label: 'Staff accede a incidencias',
  email: process.env.TEST_AUTH_STAFF_EMAIL ?? 'admin@example.com',
  password: process.env.TEST_AUTH_STAFF_PASSWORD ?? 'admin123',
  targetPath: '/marketplace-refactored/incidencias',
  assertContent: async (page) => {
    const heading = page.locator('h1', { hasText: /Gestión de Incidencias/i }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  },
};

const sellerScenario: ProtectedScenario = {
  label: 'Seller accede a sus productos',
  email: process.env.TEST_AUTH_SELLER_EMAIL ?? 'pruebasjos05@gmail.com',
  password: process.env.TEST_AUTH_SELLER_PASSWORD ?? 'password123',
  targetPath: '/marketplace-refactored/mis-productos',
  assertContent: async (page) => {
    const mainSection = page.locator('main').locator('text=/Mis Publicaciones|Gestiona tus productos/i').first();
    await expect(mainSection).toBeVisible({ timeout: 15000 });
  },
};

const scenarios: ProtectedScenario[] = [staffScenario, sellerScenario];

test.describe('PS-MGA-007 — Acceso con JWT válido a ruta protegida', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  for (const scenario of scenarios) {
    test(`debería permitir acceso directo para ${scenario.label}`, async ({ page }) => {
      let token: string | null = null;

      await test.step('Autenticarse para obtener un token válido', async () => {
        await page.goto('/login');
        await page.waitForLoadState('domcontentloaded');

        const emailInput = page.locator('input[type="email"], input#email').first();
        const passwordInput = page.locator('input[type="password"], input#password').first();
        await expect(emailInput).toBeVisible({ timeout: 10000 });
        await expect(passwordInput).toBeVisible({ timeout: 10000 });

        await emailInput.fill(scenario.email);
        await passwordInput.fill(scenario.password);

        const submitButton = page
          .locator('button[type="submit"]')
          .filter({ hasText: /Entrar|Iniciar sesión|Ingresar/i })
          .first();
        await submitButton.click();

        await expect.poll(() => page.url(), { timeout: 20000 }).toContain('/marketplace-refactored');
        token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
        expect(token, 'Se esperaba obtener un token después del login').toBeTruthy();
      });

      await test.step('Navegar a la ruta protegida de destino', async () => {
        await page.goto(scenario.targetPath);
        await page.waitForLoadState('networkidle');

        await expect.poll(() => page.url(), { timeout: 10000 }).toContain(scenario.targetPath);
        await scenario.assertContent(page);
      });

      await test.step('Verificar que el token siga presente', async () => {
        const persistedToken = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
        expect(persistedToken, 'El token debería persistir durante la sesión').toBe(token);
      });

      await test.step('Cerrar sesión limpiando el almacenamiento', async () => {
        await page.evaluate((key) => window.localStorage.removeItem(key), TOKEN_STORAGE_KEY);
        await page.context().clearCookies();
      });
    });
  }
});

