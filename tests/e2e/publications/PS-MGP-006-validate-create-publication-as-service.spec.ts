import { test, expect } from '@playwright/test';
import * as path from 'path';

const TEST_EMAIL = 'pruebasjos05@gmail.com';
const TEST_PASSWORD = 'password123';
const SERVICE_TITLE = 'Servicio de Reparación de Computadoras';
const SERVICE_DESCRIPTION = 'Servicio profesional de reparación y mantenimiento de computadoras, laptops y equipos informáticos. Diagnóstico gratuito, reparación rápida y garantía en todos nuestros trabajos.';
const SERVICE_PRICE = '25.00';
const SERVICE_SCHEDULE = 'Lun-Vie 9:00-18:00, Sáb 10:00-14:00';
const SERVICE_CATEGORY = 'Servicios Profesionales';
const IMAGE_PATH = path.join(process.cwd(), 'tests', 'e2e', 'publications', 'images', 'reparacion.jpg');

test.describe('PS-MGP-006 - Creación de una publicación como servicio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería permitir crear una publicación como servicio con horario de atención', async ({ page }) => {
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

    await test.step('Llenar el campo Título', async () => {
      const titleField = page.locator('input#name').first();
      await expect(titleField).toBeVisible({ timeout: 10000 });
      await titleField.clear();
      await titleField.fill(SERVICE_TITLE);
      await page.waitForTimeout(500);
    });

    await test.step('Llenar el campo Descripción', async () => {
      const descriptionField = page.locator('textarea#description').first();
      await expect(descriptionField).toBeVisible({ timeout: 10000 });
      await descriptionField.clear();
      await descriptionField.fill(SERVICE_DESCRIPTION);
      await page.waitForTimeout(500);
    });

    await test.step('Llenar el campo Precio', async () => {
      const priceField = page.locator('input#price').first();
      await expect(priceField).toBeVisible({ timeout: 10000 });
      await priceField.clear();
      await priceField.fill(SERVICE_PRICE);
      await page.waitForTimeout(500);
    });

    await test.step('Seleccionar la categoría "Servicios Profesionales"', async () => {
      await page.waitForTimeout(1000);
      const categorySelect = page.locator('select#categoryId').first();
      await expect(categorySelect).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
      const options = categorySelect.locator('option');
      const optionCount = await options.count();
      let selected = false;
      for (let i = 0; i < optionCount; i++) {
        const optionText = await options.nth(i).textContent();
        if (optionText && optionText.includes(SERVICE_CATEGORY)) {
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

    await test.step('Marcar el checkbox "¿Es un servicio?"', async () => {
      const serviceLabel = page.locator('label').filter({ hasText: /¿Es un servicio\?/i }).first();
      await expect(serviceLabel).toBeVisible({ timeout: 10000 });
      const checkbox = serviceLabel.locator('input[type="checkbox"]').first();
      await expect(checkbox).toBeVisible({ timeout: 5000 });
      await checkbox.click();
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que aparece el campo "Horario de atención"', async () => {
      const scheduleLabel = page.locator('label').filter({ hasText: /Horario de atención/i }).first();
      await expect(scheduleLabel).toBeVisible({ timeout: 5000 });
      const scheduleField = page.locator('input#workingHours').first();
      await expect(scheduleField).toBeVisible({ timeout: 5000 });
      await page.waitForTimeout(500);
    });

    await test.step('Llenar el campo "Horario de atención"', async () => {
      const scheduleField = page.locator('input#workingHours').first();
      await scheduleField.clear();
      await scheduleField.fill(SERVICE_SCHEDULE);
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

    await test.step('Subir la imagen del servicio', async () => {
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

    await test.step('Enviar el formulario para crear la publicación como servicio', async () => {
      const publishButton = page.locator('button[type="submit"]').filter({ hasText: /Publicar/i }).first();
      await expect(publishButton).toBeVisible({ timeout: 10000 });
      await expect(publishButton).toBeEnabled();
      await publishButton.click();
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(2000);
      await page.waitForURL(/\/mis-productos/, { timeout: 15000 });
      expect(page.url()).toContain('/marketplace-refactored/mis-productos');
      await page.waitForTimeout(1500);
    });

    await test.step('Verificar que la nueva publicación de servicio aparece en la lista', async () => {
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      const pageTitle = page.locator('text=/Mis Publicaciones/i').first();
      await expect(pageTitle).toBeVisible({ timeout: 10000 });
      const servicePublicationCard = page.locator('text=/Servicio de Reparación|Reparación/i').first();
      await expect(servicePublicationCard).toBeVisible({ timeout: 15000 });
    });
  });
});
