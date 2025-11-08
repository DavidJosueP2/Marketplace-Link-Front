import { test, expect } from '@playwright/test';

test.describe('PS-MGP-003 - Ocultamiento y prohibición de la sección de gestión de publicaciones para usuarios no vendedores', () => {
  const TEST_EMAIL = 'buyer@example.com';
  const TEST_PASSWORD = 'password123';

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería verificar que la sección Mis Productos no es visible para usuarios no vendedores', async ({ page }) => {
    await test.step('Iniciar sesión', async () => {
      const emailInput = page.locator('input[type="email"], input#email').first();
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await emailInput.fill(TEST_EMAIL);

      const passwordInput = page.locator('input[type="password"], input#password').first();
      await expect(passwordInput).toBeVisible();
      await passwordInput.fill(TEST_PASSWORD);

      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Entrar|Ingresar/i });
      await expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForURL(/\/marketplace-refactored/, { timeout: 15000 });
      expect(page.url()).toContain('/marketplace-refactored');
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que el botón "Mis Productos" no aparece en el header', async () => {
      await page.waitForLoadState('networkidle');
      const misProductosButton = page.locator('button, a').filter({ hasText: /^Mis Productos$/i });
      const buttonCount = await misProductosButton.count();
      expect(buttonCount).toBe(0);
      await page.waitForTimeout(1000);
    });

    await test.step('Intentar acceder directamente a la página "Mis Productos"', async () => {
      await page.goto('/marketplace-refactored/mis-productos');
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      const isStillOnMisProductos = currentUrl.includes('/mis-productos');
      expect(isStillOnMisProductos).toBe(false);
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que el acceso directo está bloqueado', async () => {
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('/mis-productos');
      const misPublicacionesTitle = page.locator('text=/Mis Publicaciones/i').first();
      const isTitleVisible = await misPublicacionesTitle.isVisible({ timeout: 2000 }).catch(() => false);
      expect(isTitleVisible).toBe(false);
      await page.waitForTimeout(1000);
    });
  });
});
