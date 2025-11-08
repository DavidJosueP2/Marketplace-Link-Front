import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'pruebasjos05@gmail.com';
const TEST_PASSWORD = 'password123';

test.describe('PS-MGP-005 - Validación de errores en formulario de publicación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería mostrar errores cuando se intenta crear una publicación sin llenar campos requeridos', async ({ page }) => {
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

    await test.step('Navegar a la sección "Mis Publicaciones"', async () => {
      await page.waitForLoadState('networkidle');
      const misProductosButton = page.locator('button, a').filter({ hasText: /Mis Productos/i }).first();
      await expect(misProductosButton).toBeVisible({ timeout: 10000 });
      await misProductosButton.click();
      await page.waitForURL(/\/marketplace-refactored\/mis-productos/, { timeout: 10000 });
      expect(page.url()).toContain('/marketplace-refactored/mis-productos');
      await page.waitForTimeout(1000);
    });

    await test.step('Hacer clic en el botón "Nueva Publicación"', async () => {
      const newPublicationButton = page.locator('button').filter({ hasText: /Nueva Publicación/i }).first();
      await expect(newPublicationButton).toBeVisible({ timeout: 10000 });
      await newPublicationButton.click();
      await page.waitForURL(/\/marketplace-refactored\/publicar/, { timeout: 10000 });
      expect(page.url()).toContain('/marketplace-refactored/publicar');
      await page.waitForTimeout(1000);
    });

    await test.step('Intentar enviar el formulario sin llenar ningún campo', async () => {
      const publishButton = page.locator('button[type="submit"]').filter({ hasText: /Publicar/i }).first();
      await expect(publishButton).toBeVisible({ timeout: 10000 });
      await publishButton.click();
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('/marketplace-refactored/publicar');
      const titleError = page.locator('text=/El título es obligatorio/i').first();
      await expect(titleError).toBeVisible({ timeout: 5000 });
      const descriptionError = page.locator('text=/La descripción es obligatoria/i').first();
      await expect(descriptionError).toBeVisible({ timeout: 5000 });
      const priceError = page.locator('text=/El precio es obligatorio/i').first();
      await expect(priceError).toBeVisible({ timeout: 5000 });
      const categoryError = page.locator('text=/La categoría es obligatoria/i').first();
      await expect(categoryError).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(1000);
    });

    await test.step('Presionar el botón "Volver a mis publicaciones" para cancelar la creación', async () => {
      const backButton = page.locator('button').filter({ hasText: /Volver a mis publicaciones/i }).first();
      await expect(backButton).toBeVisible({ timeout: 10000 });
      await backButton.click();
      await page.waitForURL(/\/marketplace-refactored\/mis-productos/, { timeout: 10000 });
      expect(page.url()).toContain('/marketplace-refactored/mis-productos');
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que NO se creó ninguna publicación y se regresó a la página anterior', async () => {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      const pageTitle = page.locator('text=/Mis Publicaciones/i').first();
      await expect(pageTitle).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    });
  });
});
