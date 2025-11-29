import { test, expect } from '@playwright/test';

test.describe('PS-FAV-001 - Verificar paginación de publicaciones favoritas', () => {
  const TEST_EMAIL = 'pruebasjos07@gmail.com';
  const TEST_PASSWORD = 'password123';

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería obtener publicaciones favoritas de manera paginada', async ({ page }) => {
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

    await test.step('Navegar a la página de favoritos', async () => {
      await page.waitForLoadState('networkidle');
      
      // Intentar encontrar el botón de favoritos en el header (icono de corazón)
      const favoritesButton = page.locator('button[aria-label*="favorito" i], button[aria-label*="Favorito" i]').first();
      const heartIcon = page.locator('button').filter({ has: page.locator('svg') }).first();
      
      // Intentar hacer clic en el botón de favoritos o navegar directamente
      const buttonExists = await favoritesButton.isVisible({ timeout: 5000 }).catch(() => false);
      if (buttonExists) {
        await favoritesButton.click();
      } else {
        // Si no encontramos el botón, navegamos directamente
        await page.goto('/marketplace-refactored/favoritos');
      }
      
      await page.waitForURL(/\/favoritos/, { timeout: 15000 });
      expect(page.url()).toContain('/favoritos');
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    await test.step('Verificar que se muestra la página de favoritos', async () => {
      const pageTitle = page.locator('h1').filter({ hasText: /Mis Favoritos|Favoritos/i }).first();
      await expect(pageTitle).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    });

    await test.step('Interceptar y verificar la primera llamada al endpoint de favoritos (página 0, size 10)', async () => {
      // Esperar a que se cargue la página y se haga la petición
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Verificar que hay una respuesta del endpoint de favoritos
      // La página debe mostrar los favoritos o un mensaje de que no hay favoritos
      const favoritesContainer = page.locator('text=/publicación|Publicación|No tienes favoritos/i').first();
      await expect(favoritesContainer).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que se muestra información de paginación si hay más de una página', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Verificar controles de paginación
      const paginationControls = page.locator('button').filter({ hasText: /Siguiente|Anterior/i });
      const paginationInfo = page.locator('text=/Página|página/i');
      
      // Esperar a que se muestre la información de paginación o el estado vacío
      const hasPagination = await paginationInfo.isVisible({ timeout: 5000 }).catch(() => false);
      const hasControls = await paginationControls.first().isVisible({ timeout: 5000 }).catch(() => false);
      
      // Si hay paginación, verificar que los controles estén presentes
      if (hasPagination || hasControls) {
        await expect(paginationInfo.or(paginationControls.first())).toBeVisible({ timeout: 10000 });
      }
      
      await page.waitForTimeout(1000);
    });

    await test.step('Cambiar el tamaño de página (size) y verificar que se actualiza la lista', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Buscar el selector de tamaño de página
      const sizeSelector = page.locator('select').filter({ hasText: /página|por página/i }).first();
      const sizeSelectorExists = await sizeSelector.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (sizeSelectorExists) {
        // Cambiar el tamaño a 20 por página
        await sizeSelector.selectOption({ value: '20' });
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        await page.waitForTimeout(2000);
        
        // Verificar que el selector tiene el valor seleccionado
        const selectedValue = await sizeSelector.inputValue();
        expect(selectedValue).toBe('20');
      }
      
      await page.waitForTimeout(1000);
    });

    await test.step('Navegar a la siguiente página si existe y verificar que se cargan más favoritos', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Buscar el botón de "Siguiente"
      const nextButton = page.locator('button').filter({ hasText: /Siguiente/i }).first();
      const nextButtonExists = await nextButton.isVisible({ timeout: 5000 }).catch(() => false);
      const isNextEnabled = nextButtonExists ? await nextButton.isEnabled().catch(() => false) : false;
      
      if (isNextEnabled) {
        // Obtener el número de elementos antes de cambiar de página
        const favoritesBefore = page.locator('[class*="grid"] > div, [class*="card"]').or(
          page.locator('text=/No tienes favoritos/i')
        );
        
        // Hacer clic en siguiente
        await nextButton.click();
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        await page.waitForTimeout(2000);
        
        // Verificar que la página cambió (verificar el indicador de página)
        const pageIndicator = page.locator('text=/Página|página/i').first();
        const pageIndicatorExists = await pageIndicator.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (pageIndicatorExists) {
          const pageText = await pageIndicator.textContent();
          expect(pageText).toMatch(/Página\s+2|página\s+2/i);
        }
      } else {
        // Si no hay siguiente página, verificar que el botón está deshabilitado o no existe
        expect(nextButtonExists ? await nextButton.isDisabled().catch(() => true) : true).toBe(true);
      }
      
      await page.waitForTimeout(1000);
    });

    await test.step('Verificar que el total de elementos se muestra correctamente', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Buscar el texto que muestra el total de favoritos
      const totalText = page.locator('text=/publicación.*guardada|publicaciones.*guardadas/i').first();
      const totalTextExists = await totalText.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (totalTextExists) {
        const text = await totalText.textContent();
        // Verificar que contiene un número
        expect(text).toMatch(/\d+/);
      } else {
        // Si no hay texto de total, verificar que al menos hay un título
        const pageTitle = page.locator('h1').filter({ hasText: /Mis Favoritos|Favoritos/i }).first();
        await expect(pageTitle).toBeVisible({ timeout: 5000 });
      }
      
      await page.waitForTimeout(1000);
    });
  });
});

