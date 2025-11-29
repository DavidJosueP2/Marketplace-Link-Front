import { test, expect } from '@playwright/test';

const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

interface Scenario {
  name: string;
  email: string;
  password: string;
  messagePattern: RegExp;
}

const SCENARIOS: Scenario[] = [
  {
    name: 'cuenta no verificada',
    email: 'pruebasjos04@gmail.com',
    password: 'password123',
    messagePattern: /pendiente de verificación|revisa tu correo/i,
  },
  {
    name: 'cuenta bloqueada',
    email: 'prueba.cuenta.5212@gmail.com',
    password: 'password123',
    messagePattern: /cuenta está bloqueada|contacta al administrador/i,
  },
];

test.describe('PS-MGA-004 — Login con usuario no verificado o bloqueado', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await page.goto(LOGIN_PATH);
    await page.waitForLoadState('domcontentloaded');
  });

  for (const scenario of SCENARIOS) {
    test(`debería rechazar el inicio de sesión para ${scenario.name}`, async ({ page }) => {
      await test.step('Ingresar credenciales y enviar', async () => {
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

        const loginResponsePromise = page.waitForResponse((response) => {
          const url = response.url();
          return url.includes('/login') && response.request().method() === 'POST';
        });

        await submitButton.click();

        const loginResponse = await loginResponsePromise;
        expect(loginResponse.status(), 'El servicio debería responder 401').toBe(401);
      });

      await test.step('Validar mensaje de error y permanencia en login', async () => {
        const errorMessage = page.locator('form div').filter({ hasText: scenario.messagePattern }).first();
        await expect(errorMessage).toBeVisible({ timeout: 10000 });

        await expect.poll(() => page.url(), { timeout: 5000 }).toContain(LOGIN_PATH);
      });

      await test.step('Confirmar que no se generó token', async () => {
        const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
        expect(token).toBeNull();
      });
    });
  }
});

