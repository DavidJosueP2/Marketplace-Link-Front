import { test, expect } from '@playwright/test';

test.describe('PS-MGP-001 - Visualización de publicación y uso de filtros ', () => {
  const TEST_EMAIL = 'pruebasjos07@gmail.com';
  const TEST_PASSWORD = 'password123';
  const FILTER_DISTANCE = '5 km';
  const FILTER_MIN_PRICE = '30';
  const FILTER_MAX_PRICE = '500';
  const FILTER_CATEGORY = 'Hogar';

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería visualizar publicación y usar filtros correctamente', async ({ page }) => {
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
      await page.waitForLoadState('networkidle');
      const welcomeTitle = page.locator('text=/¡Bienvenido!|Bienvenido/i').first();
      await expect(welcomeTitle).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que el panel lateral de filtros está visible', async () => {
      const filterPanelByTitle = page.locator('h3, div').filter({ hasText: /^Filtros$/ }).first();
      await expect(filterPanelByTitle).toBeVisible({ timeout: 10000 });
      const categoriesSection = page.locator('text=Categorías').first();
      await expect(categoriesSection).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    });

    await test.step(`Aplicar filtro de distancia: ${FILTER_DISTANCE}`, async () => {
      const distanceSection = page.locator('text=/Distancia a la redonda/i').locator('..');
      const distanceLabel = distanceSection.locator('label').filter({ hasText: new RegExp(`^${FILTER_DISTANCE}$`, 'i') }).first();
      await expect(distanceLabel).toBeVisible({ timeout: 10000 });
      const distanceRadio = distanceLabel.locator('input[type="radio"]').first();
      await expect(distanceRadio).toBeVisible({ timeout: 10000 });
      await distanceRadio.click();
      await expect(distanceRadio).toBeChecked();
      await page.waitForTimeout(1500);
    });

    await test.step(`Aplicar filtro de precio: $${FILTER_MIN_PRICE} - $${FILTER_MAX_PRICE}`, async () => {
      const priceSection = page.locator('text=/Rango de Precio/i').locator('..');
      const minPriceInput = priceSection.locator('input[type="number"]').first();
      await expect(minPriceInput).toBeVisible({ timeout: 10000 });
      await minPriceInput.clear();
      await minPriceInput.fill(FILTER_MIN_PRICE);
      const maxPriceInput = priceSection.locator('input[type="number"]').nth(1);
      await expect(maxPriceInput).toBeVisible({ timeout: 10000 });
      await maxPriceInput.clear();
      await maxPriceInput.fill(FILTER_MAX_PRICE);
      await page.waitForTimeout(1500);
    });

    await test.step(`Aplicar filtro de categoría: ${FILTER_CATEGORY}`, async () => {
      const categoriesSection = page.locator('text=Categorías').locator('..');
      const categoryLabel = categoriesSection.locator('label').filter({ hasText: new RegExp(`^${FILTER_CATEGORY}$`, 'i') }).first();
      await expect(categoryLabel).toBeVisible({ timeout: 10000 });
      const categoryCheckbox = categoryLabel.locator('input[type="checkbox"]').first();
      await expect(categoryCheckbox).toBeVisible({ timeout: 10000 });
      const isChecked = await categoryCheckbox.isChecked();
      if (!isChecked) {
        await categoryCheckbox.click();
      }
      await page.waitForTimeout(1500);
    });

    await test.step('Verificar que la lista de publicaciones se actualiza automáticamente', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      await page.waitForTimeout(2000);
      const publicationsContainer = page.locator('div[class*="grid"]').or(
        page.locator('text=/No se encontraron publicaciones/i')
      ).first();
      await expect(publicationsContainer).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1500);
    });
  });
});
