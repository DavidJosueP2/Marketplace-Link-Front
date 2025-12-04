import { test, expect, type Page } from '@playwright/test';

const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

interface Scenario {
  label: string;
  email: string;
  password: string;
  expectedUrl: RegExp;
  assertUi: (page: Page) => Promise<void>;
  expectToken?: boolean;
  skip?: boolean;
  skipReason?: string;
}

const staffAccount: Scenario = {
  label: 'usuario STAFF',
  email: process.env.TEST_AUTH_STAFF_EMAIL ?? 'admin@example.com',
  password: process.env.TEST_AUTH_STAFF_PASSWORD ?? 'admin123',
  expectedUrl: /\/marketplace-refactored\/incidencias/i,
  expectToken: true,
  assertUi: async (page) => {
    const heading = page.locator('h1', { hasText: /Gestión de Incidencias/i }).first();
    await expect(heading).toBeVisible({ timeout: 15000 });
  },
};

const buyerAccount: Scenario = {
  label: 'usuario BUYER',
  email: process.env.TEST_AUTH_BUYER_EMAIL ?? 'buyer@example.com',
  password: process.env.TEST_AUTH_BUYER_PASSWORD ?? 'password123',
  expectedUrl: /\/marketplace-refactored\/publications/i,
  expectToken: true,
  assertUi: async (page) => {
    const content = page.locator('text=/¡Bienvenido! Explora diferentes servicios|Categorías/i').first();
    await expect(content).toBeVisible({ timeout: 15000 });
  },
};

const sellerAccount: Scenario = {
  label: 'usuario SELLER',
  email: process.env.TEST_AUTH_SELLER_EMAIL ?? 'pruebasjos05@gmail.com',
  password: process.env.TEST_AUTH_SELLER_PASSWORD ?? 'password123',
  expectedUrl: /\/marketplace-refactored\/publications/i,
  expectToken: true,
  assertUi: async (page) => {
    const content = page.locator('text=/¡Bienvenido! Explora diferentes servicios|Categorías/i').first();
    await expect(content).toBeVisible({ timeout: 15000 });
  },
};

const noRoleEmail = process.env.TEST_AUTH_ROLELESS_EMAIL ?? 'norole@email.com';
const noRolePassword = process.env.TEST_AUTH_ROLELESS_PASSWORD ?? 'password123';

const noRoleAccount: Scenario = {
  label: 'usuario SIN ROL',
  email: noRoleEmail,
  password: noRolePassword,
  expectedUrl: /\/404$/i,
  expectToken: true,
  skip: false,
  assertUi: async (page) => {
    const message = page.locator('text=/404|Página no encontrada/i').first();
    await expect(message).toBeVisible({ timeout: 15000 });
  },
};

const scenarios: Scenario[] = [staffAccount, buyerAccount, sellerAccount, noRoleAccount];

test.describe('PS-MGA-005 — Redirección por rol al entrar autenticado', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await page.goto(LOGIN_PATH);
    await page.waitForLoadState('domcontentloaded');
  });

  for (const scenario of scenarios) {
    test(`debería redirigir correctamente para ${scenario.label}`, async ({ page }) => {
      test.skip(!!scenario.skip, scenario.skipReason);

      await test.step('Ingresar credenciales y autenticar', async () => {
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
        await expect(submitButton).toBeVisible({ timeout: 10000 });
        await submitButton.click();
      });

      await test.step('Esperar la redirección según el rol', async () => {
        await expect
          .poll(() => page.url(), { timeout: 20000 })
          .toMatch(scenario.expectedUrl);
        await scenario.assertUi(page);
      });

      if (scenario.expectToken) {
        await test.step('Verificar que se generó el token de acceso', async () => {
          const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
          expect(token, 'Se esperaba encontrar un token JWT tras el inicio de sesión').toBeTruthy();
        });
      }

      await test.step('Limpiar sesión', async () => {
        await page.evaluate((key) => window.localStorage.removeItem(key), TOKEN_STORAGE_KEY);
        await page.context().clearCookies();
      });
    });
  }
});

