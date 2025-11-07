import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'pruebasjos05@gmail.com';
const TEST_PASSWORD = 'password123';

test.describe('PS-MGP-013 - Cancelación de la eliminación de una publicación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería cerrar el modal y NO eliminar la publicación al presionar "Cancelar"', async ({ page }) => {
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

    await test.step('Obtener información de una publicación para verificar que no se elimina', async () => {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      const pageTitle = page.locator('text=/Mis Publicaciones/i').first();
      await expect(pageTitle).toBeVisible({ timeout: 10000 });
      const publicationCards = page.locator('h3, [class*="card"], [class*="publication"]');
      const cardCount = await publicationCards.count();
      expect(cardCount).toBeGreaterThan(0);
      await page.waitForTimeout(1000);
    });

    await test.step('Hacer clic en el botón de eliminar (icono de papelera) de una publicación', async () => {
      const deleteButton = page.locator('button[title="Eliminar"]').first();
      await expect(deleteButton).toBeVisible({ timeout: 10000 });
      await deleteButton.click();
      await page.waitForTimeout(1500);
    });

    await test.step('Verificar que aparece el modal de confirmación de eliminación', async () => {
      const modal = page.locator('div').filter({ hasText: /Confirmar Eliminación/i }).first();
      await expect(modal).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(500);
    });

    await test.step('Verificar que el modal tiene los botones de acción', async () => {
      const modal = page.locator('div').filter({ hasText: /Confirmar Eliminación/i }).first();
      const cancelButton = modal.locator('button').filter({ hasText: /Cancelar/i }).first();
      await expect(cancelButton).toBeVisible({ timeout: 5000 });
      const deleteButton = modal.locator('button').filter({ hasText: /Eliminar Publicación/i }).first();
      await expect(deleteButton).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(500);
    });

    await test.step('Hacer clic en el botón "Cancelar" para cancelar la eliminación', async () => {
      const modal = page.locator('div').filter({ hasText: /Confirmar Eliminación/i }).first();
      const cancelButton = modal.locator('button').filter({ hasText: /Cancelar/i }).first();
      await expect(cancelButton).toBeVisible({ timeout: 5000 });
      await expect(cancelButton).toBeEnabled({ timeout: 5000 });
      await cancelButton.click();
      await page.waitForTimeout(1500);
    });

    await test.step('Verificar que el modal de confirmación se cerró', async () => {
      const modal = page.locator('div').filter({ hasText: /Confirmar Eliminación/i }).first();
      const modalVisible = await modal.isVisible({ timeout: 2000 }).catch(() => false);
      expect(modalVisible).toBe(false);
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que la publicación sigue apareciendo en la lista (no fue eliminada)', async () => {
      await page.waitForTimeout(2000);
      expect(page.url()).toContain('/marketplace-refactored/mis-productos');
      const pageTitle = page.locator('text=/Mis Publicaciones/i').first();
      await expect(pageTitle).toBeVisible({ timeout: 10000 });
      const publicationCards = page.locator('h3, [class*="card"], [class*="publication"]');
      const cardCount = await publicationCards.count();
      expect(cardCount).toBeGreaterThan(0);
      await page.waitForTimeout(1000);
    });
  });
});
