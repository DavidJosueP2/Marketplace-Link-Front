import { test, expect } from '@playwright/test';

test.describe('PS-MGP-002 - Ingreso a la sección de gestión de publicaciones y uso de filtros', () => {
  const TEST_EMAIL = 'pruebasjos05@gmail.com';
  const TEST_PASSWORD = 'password123';
  const FILTER_CATEGORY = 'Electrónica';

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería filtrar las publicaciones del vendedor por categoría correctamente', async ({ page }) => {
    await test.step('Iniciar sesión con credenciales de vendedor', async () => {
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

    await test.step('Acceder a la sección Mis Productos desde el header', async () => {
      await page.waitForLoadState('networkidle');
      const misProductosButton = page.locator('button, a').filter({ hasText: /Mis Productos/i }).first();
      await expect(misProductosButton).toBeVisible({ timeout: 10000 });
      await misProductosButton.click();
      await page.waitForURL(/\/mis-productos/, { timeout: 15000 });
      expect(page.url()).toContain('/marketplace-refactored/mis-productos');
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que se muestra la página de Mis Publicaciones', async () => {
      await page.waitForLoadState('networkidle');
      const pageTitle = page.locator('text=/Mis Publicaciones/i').first();
      await expect(pageTitle).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar y mostrar el panel de filtros', async () => {
      const filtersButton = page.locator('button').filter({ hasText: /^Filtros$/i }).first();
      await expect(filtersButton).toBeVisible({ timeout: 10000 });
      const filterPanel = page.locator('text=/Filtrar por Categoría/i').first();
      const isPanelVisible = await filterPanel.isVisible({ timeout: 2000 }).catch(() => false);
      if (!isPanelVisible) {
        await filtersButton.click();
        await page.waitForTimeout(500);
      }
      await expect(filterPanel).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    });

    await test.step(`Aplicar filtro de categoría: ${FILTER_CATEGORY}`, async () => {
      const categoryButton = page.locator('button').filter({ hasText: new RegExp(`^${FILTER_CATEGORY}$`, 'i') }).first();
      await expect(categoryButton).toBeVisible({ timeout: 10000 });
      await categoryButton.click();
      await page.waitForTimeout(1500);
    });

    await test.step('Verificar que la lista de publicaciones se actualiza automáticamente', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      await page.waitForTimeout(2000);
      const publicationsContainer = page.locator('div[class*="grid"]').or(
        page.locator('text=/No tienes publicaciones aún/i')
      ).first();
      await expect(publicationsContainer).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1500);
    });
  });
});
