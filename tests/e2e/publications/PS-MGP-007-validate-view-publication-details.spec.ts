import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'buyer@example.com';
const TEST_PASSWORD = 'password123';

test.describe('PS-MGP-007 - Visualización detalles de una publicación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería mostrar los detalles de una publicación al hacer clic en "Ver Detalles"', async ({ page }) => {
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

    await test.step('Verificar que se muestra la lista de publicaciones', async () => {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      await page.waitForTimeout(1000);
    });

    await test.step('Hacer clic en el botón "Ver Detalles" de una publicación', async () => {
      const viewDetailsButton = page.locator('button').filter({ hasText: /Ver Detalles/i }).first();
      await expect(viewDetailsButton).toBeVisible({ timeout: 10000 });
      await viewDetailsButton.click();
      await page.waitForURL(/\/marketplace-refactored\/publication\/\d+/, { timeout: 15000 });
      expect(page.url()).toMatch(/\/marketplace-refactored\/publication\/\d+/);
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que se muestra la página de detalles con la información de la publicación', async () => {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      const backButton = page.locator('button').filter({ hasText: /Volver al catálogo|Volver a mis publicaciones/i }).first();
      await expect(backButton).toBeVisible({ timeout: 10000 });
      const publicationTitle = page.locator('h1').first();
      await expect(publicationTitle).toBeVisible({ timeout: 10000 });
      const titleText = await publicationTitle.textContent();
      expect(titleText).toBeTruthy();
      expect(titleText?.trim().length).toBeGreaterThan(0);
      const priceElement = page.locator('text=/\\$\\d+(\\.\\d{2})?/').first();
      await expect(priceElement).toBeVisible({ timeout: 10000 });
      const descriptionSection = page.locator('text=/Descripción/i').first();
      await expect(descriptionSection).toBeVisible({ timeout: 10000 });
      const categoryText = page.locator('text=/Categoría:/i').first();
      await expect(categoryText).toBeVisible({ timeout: 10000 });
      const vendorSection = page.locator('text=/Información del vendedor|Vendedor/i').first();
      await expect(vendorSection).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar elementos adicionales de la página de detalles', async () => {
      const publicationImage = page.locator('img').first();
      await expect(publicationImage).toBeVisible({ timeout: 10000 });
      const codeOrDate = page.locator('text=/Código:|Hace/i').first();
      await expect(codeOrDate).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    });
  });
});
