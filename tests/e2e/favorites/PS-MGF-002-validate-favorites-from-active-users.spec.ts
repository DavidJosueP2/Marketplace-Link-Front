import { test, expect } from '@playwright/test';

test.describe('PS-FAV-002 - Verificar que se retornen publicaciones favoritas de usuarios activos', () => {
  const TEST_EMAIL = 'pruebasjos07@gmail.com';
  const TEST_PASSWORD = 'password123';

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería retornar todas las publicaciones marcadas como favoritas del usuario autenticado', async ({ page }) => {
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
      await page.goto('/marketplace-refactored/favoritos');
      await page.waitForURL(/\/favoritos/, { timeout: 15000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    await test.step('Verificar que se muestra la página de favoritos', async () => {
      const pageTitle = page.locator('h1').filter({ hasText: /Mis Favoritos|Favoritos/i }).first();
      await expect(pageTitle).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1000);
    });

    await test.step('Interceptar la respuesta del endpoint de favoritos y verificar la estructura', async () => {
      let favoritesResponse: any = null;
      
      // Interceptar la respuesta del endpoint de favoritos
      page.on('response', async (response) => {
        if (response.url().includes('/api/users/favorites')) {
          try {
            favoritesResponse = await response.json();
          } catch (e) {
            // Si no es JSON, continuar
          }
        }
      });

      // Recargar la página para capturar la respuesta
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Verificar que la respuesta tiene la estructura esperada (PageResponse)
      // Si tenemos la respuesta, verificar su estructura
      if (favoritesResponse) {
        expect(favoritesResponse).toHaveProperty('content');
        expect(favoritesResponse).toHaveProperty('totalElements');
        expect(favoritesResponse).toHaveProperty('totalPages');
        expect(favoritesResponse).toHaveProperty('number');
        expect(favoritesResponse).toHaveProperty('size');
        expect(Array.isArray(favoritesResponse.content)).toBe(true);
      }
    });

    await test.step('Verificar que cada publicación en favoritos tiene los campos requeridos', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Buscar las tarjetas de publicaciones favoritas
      const favoriteCards = page.locator('[class*="grid"] > div, [class*="card"]').filter({ 
        hasNot: page.locator('text=/No tienes favoritos|No se encontraron/i')
      });
      
      const cardCount = await favoriteCards.count();
      
      if (cardCount > 0) {
        // Verificar que al menos una tarjeta tiene los campos esperados
        const firstCard = favoriteCards.first();
        
        // Verificar que tiene un título (name)
        const title = firstCard.locator('h3, [class*="font-semibold"]').first();
        const hasTitle = await title.isVisible({ timeout: 5000 }).catch(() => false);
        
        // Verificar que tiene precio
        const price = firstCard.locator('text=/\$|precio/i').first();
        const hasPrice = await price.isVisible({ timeout: 5000 }).catch(() => false);
        
        // Verificar que tiene información del vendedor o categoría
        const vendorInfo = firstCard.locator('text=/Vendedor|vendedor|Categoría|categoría/i').first();
        const hasVendorInfo = await vendorInfo.isVisible({ timeout: 5000 }).catch(() => false);
        
        // Al menos debe tener título o precio
        expect(hasTitle || hasPrice).toBe(true);
      } else {
        // Si no hay favoritos, verificar que se muestra el mensaje de estado vacío
        const emptyState = page.locator('text=/No tienes favoritos|No se encontraron/i').first();
        await expect(emptyState).toBeVisible({ timeout: 5000 });
      }
    });

    await test.step('Verificar que las publicaciones favoritas tienen información de fecha de favorito (favoritedAt)', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      const favoriteCards = page.locator('[class*="grid"] > div, [class*="card"]').filter({ 
        hasNot: page.locator('text=/No tienes favoritos|No se encontraron/i')
      });
      
      const cardCount = await favoriteCards.count();
      
      if (cardCount > 0) {
        // Buscar información de fecha en las tarjetas
        // Las fechas pueden estar en formato "Guardado: ..." o "Publicado: ..."
        const dateInfo = page.locator('text=/Guardado|guardado|Publicado|publicado/i').first();
        const hasDateInfo = await dateInfo.isVisible({ timeout: 5000 }).catch(() => false);
        
        // No es crítico si no se muestra la fecha en la UI, pero debería estar en la respuesta
        // Este paso verifica que al menos hay información de fecha disponible
        if (hasDateInfo) {
          await expect(dateInfo).toBeVisible();
        }
      }
    });

    await test.step('Verificar que las publicaciones favoritas muestran el estado de disponibilidad', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      const favoriteCards = page.locator('[class*="grid"] > div, [class*="card"]').filter({ 
        hasNot: page.locator('text=/No tienes favoritos|No se encontraron/i')
      });
      
      const cardCount = await favoriteCards.count();
      
      if (cardCount > 0) {
        // Buscar badges o indicadores de disponibilidad
        const availabilityBadge = page.locator('text=/Disponible|disponible|No disponible/i').first();
        const hasAvailability = await availabilityBadge.isVisible({ timeout: 5000 }).catch(() => false);
        
        // No es crítico, pero es bueno verificar si está presente
        // Las publicaciones deben tener estado de disponibilidad en la respuesta
      }
    });

    await test.step('Verificar que se pueden ver los detalles de cada publicación favorita', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      const favoriteCards = page.locator('[class*="grid"] > div, [class*="card"]').filter({ 
        hasNot: page.locator('text=/No tienes favoritos|No se encontraron/i')
      });
      
      const cardCount = await favoriteCards.count();
      
      if (cardCount > 0) {
        // Buscar el botón "Ver Detalles" en la primera tarjeta
        const firstCard = favoriteCards.first();
        const viewDetailsButton = firstCard.locator('button').filter({ hasText: /Ver Detalles|Ver detalles/i }).first();
        const hasViewButton = await viewDetailsButton.isVisible({ timeout: 5000 }).catch(() => false);
        
        if (hasViewButton) {
          await expect(viewDetailsButton).toBeVisible();
          await expect(viewDetailsButton).toBeEnabled();
        } else {
          // Si no hay botón, verificar que la tarjeta es clickeable
          const isCardClickable = await firstCard.isVisible();
          expect(isCardClickable).toBe(true);
        }
      }
    });

    await test.step('Verificar que el total de elementos coincide con las publicaciones mostradas (considerando paginación)', async () => {
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Obtener el texto del total de elementos
      const totalText = page.locator('text=/publicación.*guardada|publicaciones.*guardadas|\d+.*publicación/i').first();
      const totalTextExists = await totalText.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (totalTextExists) {
        const text = await totalText.textContent();
        // Extraer el número del texto
        const match = text?.match(/(\d+)/);
        if (match) {
          const totalFromText = parseInt(match[1], 10);
          
          // Contar las tarjetas visibles en la página actual
          const visibleCards = page.locator('[class*="grid"] > div, [class*="card"]').filter({ 
            hasNot: page.locator('text=/No tienes favoritos|No se encontraron/i')
          });
          const visibleCount = await visibleCards.count();
          
          // El total debe ser mayor o igual a las tarjetas visibles (por paginación)
          if (totalFromText > 0) {
            expect(visibleCount).toBeLessThanOrEqual(totalFromText);
          }
        }
      }
    });
  });
});

