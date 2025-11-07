import { test, expect } from '@playwright/test';

const TEST_EMAIL = 'pruebasjos05@gmail.com';
const TEST_PASSWORD = 'password123';
const NEW_TITLE = 'Smartphone 11';

test.describe('PS-MGP-009 - Actualización exitosa de una publicación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería actualizar correctamente una publicación existente', async ({ page }) => {
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

    await test.step('Navegar a la sección "Mis Publicaciones"', async () => {
      await page.waitForLoadState('networkidle');
      const misProductosButton = page.locator('button, a').filter({ hasText: /Mis Productos/i }).first();
      await expect(misProductosButton).toBeVisible({ timeout: 10000 });
      await misProductosButton.click();
      await page.waitForURL(/\/marketplace-refactored\/mis-productos/, { timeout: 10000 });
      expect(page.url()).toContain('/marketplace-refactored/mis-productos');
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que hay al menos una publicación en la lista', async () => {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      const pageTitle = page.locator('text=/Mis Publicaciones/i').first();
      await expect(pageTitle).toBeVisible({ timeout: 10000 });
      const publicationCards = page.locator('h3, [class*="card"], [class*="publication"]');
      const cardCount = await publicationCards.count();
      expect(cardCount).toBeGreaterThan(0);
      await page.waitForTimeout(1000);
    });

    await test.step('Hacer clic en el botón "Editar" de la primera publicación disponible', async () => {
      const editButtons = page.locator('button').filter({ hasText: /Editar/i });
      const editButtonCount = await editButtons.count();
      expect(editButtonCount).toBeGreaterThan(0);
      const firstEditButton = editButtons.first();
      await expect(firstEditButton).toBeVisible({ timeout: 10000 });
      await firstEditButton.click();
      await page.waitForURL(/\/marketplace-refactored\/editar\/\d+/, { timeout: 10000 });
      expect(page.url()).toContain('/marketplace-refactored/editar/');
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que el formulario de edición se carga con los datos existentes', async () => {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      const formTitle = page.locator('h1').filter({ hasText: /Editar/i }).first();
      await expect(formTitle).toBeVisible({ timeout: 10000 });
      const titleField = page.locator('input#name').first();
      await expect(titleField).toBeVisible({ timeout: 10000 });
      const titleValue = await titleField.inputValue();
      expect(titleValue).not.toBe('');
      await page.waitForTimeout(1000);
    });

    await test.step('Actualizar el campo Título con el nuevo valor', async () => {
      const titleField = page.locator('input#name').first();
      await titleField.clear();
      await titleField.fill(NEW_TITLE);
      await page.waitForTimeout(500);
    });

    await test.step('Guardar los cambios de la publicación', async () => {
      const updateButton = page.locator('button[type="submit"]').filter({ 
        hasText: /Actualizar/i 
      }).first();
      await expect(updateButton).toBeVisible({ timeout: 10000 });
      await expect(updateButton).toBeEnabled();
      await updateButton.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.waitForURL(/\/marketplace-refactored\/mis-productos/, { timeout: 15000 });
      expect(page.url()).toContain('/marketplace-refactored/mis-productos');
      await page.waitForTimeout(1500);
    });

    await test.step('Verificar que la publicación se actualizó exitosamente y aparece en la lista con el nuevo título', async () => {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      const pageTitle = page.locator('text=/Mis Publicaciones/i').first();
      await expect(pageTitle).toBeVisible({ timeout: 10000 });
      const updatedPublication = page.locator('text=/Smartphone 11/i').first();
      await expect(updatedPublication).toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(1000);
    });
  });
});
