import { test, expect } from '@playwright/test';
import * as path from 'path';

const TEST_EMAIL = 'pruebasjos05@gmail.com';
const TEST_PASSWORD = 'password123';
const DANGEROUS_TITLE = 'Drogas';
const PUBLICATION_DESCRIPTION = 'Venta de narcoticos.';
const PUBLICATION_PRICE = '10.00';
const PUBLICATION_CATEGORY = 'Alimentos y Bebidas';
const IMAGE_PATH = path.join(process.cwd(), 'tests', 'e2e', 'publications', 'images', 'droga.png');

test.describe('PS-MGP-007 - Detección de contenido peligroso al crear una publicación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería detectar contenido peligroso y mostrar mensaje de advertencia', async ({ page }) => {
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

    await test.step('Llenar el campo Título con contenido peligroso (drogas)', async () => {
      const titleField = page.locator('input#name').first();
      await expect(titleField).toBeVisible({ timeout: 10000 });
      await titleField.clear();
      await titleField.fill(DANGEROUS_TITLE);
      await page.waitForTimeout(500);
    });

    await test.step('Llenar el campo Descripción', async () => {
      const descriptionField = page.locator('textarea#description').first();
      await expect(descriptionField).toBeVisible({ timeout: 10000 });
      await descriptionField.clear();
      await descriptionField.fill(PUBLICATION_DESCRIPTION);
      await page.waitForTimeout(500);
    });

    await test.step('Llenar el campo Precio', async () => {
      const priceField = page.locator('input#price').first();
      await expect(priceField).toBeVisible({ timeout: 10000 });
      await priceField.clear();
      await priceField.fill(PUBLICATION_PRICE);
      await page.waitForTimeout(500);
    });

    await test.step('Seleccionar la categoría "Alimentos y Bebidas"', async () => {
      await page.waitForTimeout(1000);
      const categorySelect = page.locator('select#categoryId').first();
      await expect(categorySelect).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
      const options = categorySelect.locator('option');
      const optionCount = await options.count();
      let selected = false;
      for (let i = 0; i < optionCount; i++) {
        const optionText = await options.nth(i).textContent();
        if (optionText && (optionText.includes('Alimentos') || optionText.includes('Bebidas'))) {
          await categorySelect.selectOption({ index: i });
          selected = true;
          break;
        }
      }
      if (!selected && optionCount > 1) {
        await categorySelect.selectOption({ index: 1 });
      }
      await page.waitForTimeout(500);
    });

    await test.step('Configurar la ubicación', async () => {
      const locationLabel = page.locator('label').filter({ hasText: /Usar ubicación registrada/i }).first();
      const isLabelVisible = await locationLabel.isVisible({ timeout: 5000 }).catch(() => false);
      if (isLabelVisible) {
        const checkbox = locationLabel.locator('input[type="checkbox"]').first();
        if (await checkbox.isVisible({ timeout: 2000 }).catch(() => false)) {
          const isChecked = await checkbox.isChecked();
          if (!isChecked) {
            await checkbox.click();
            await page.waitForTimeout(500);
          }
        } else {
          await locationLabel.click();
          await page.waitForTimeout(500);
        }
      }
      await page.waitForTimeout(1000);
    });

    await test.step('Subir la imagen del producto', async () => {
      const fileInput = page.locator('input[type="file"]').first();
      await expect(fileInput).toHaveCount(1, { timeout: 10000 });
      await fileInput.setInputFiles(IMAGE_PATH);
      await page.waitForTimeout(2000);
      const imagePreviews = page.locator('img[src^="blob:"], img[src^="data:"]');
      const previewCount = await imagePreviews.count();
      const imageCount = page.locator('text=/\\d+\\/\\d+ imágenes|imágenes cargadas/i').first();
      const newBadge = page.locator('text=/Nueva/i').first();
      const hasPreview = previewCount > 0;
      const hasCount = await imageCount.isVisible({ timeout: 3000 }).catch(() => false);
      const hasBadge = await newBadge.isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasPreview || hasCount || hasBadge).toBe(true);
      await page.waitForTimeout(1000);
    });

    await test.step('Enviar el formulario con contenido peligroso', async () => {
      const publishButton = page.locator('button[type="submit"]').filter({ hasText: /Publicar/i }).first();
      await expect(publishButton).toBeVisible({ timeout: 10000 });
      await publishButton.click();
      await page.waitForURL(/\/marketplace-refactored\/mis-productos/, { timeout: 20000 });
      expect(page.url()).toContain('/marketplace-refactored/mis-productos');
      await page.waitForTimeout(2000);
    });

    await test.step('Verificar que aparece un mensaje de error o advertencia', async () => {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      const alertContainer = page.locator('div').filter({ 
        hasText: /Contenido peligroso|error|advertencia|revisión/i
      }).first();
      const alertVisible = await alertContainer.isVisible({ timeout: 10000 }).catch(() => false);
      expect(alertVisible).toBe(true);
      await page.waitForTimeout(1000);
    });
  });
});
