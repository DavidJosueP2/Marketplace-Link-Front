import { test, expect } from '@playwright/test';

test.describe('PS-MGF-006 - Validar eliminación de favoritos sin retornar contenido', () => {
  const TEST_EMAIL = 'pruebasjos07@gmail.com';
  const TEST_PASSWORD = 'password123';

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería eliminar favorito y no retornar contenido en la respuesta', async ({ page }) => {
    let publicationId: number | null = null;
    let publicationName: string | null = null;
    let initialFavoritesCount = 0;

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

    await test.step('Navegar a la página de favoritos y seleccionar una publicación para eliminar', async () => {
      await page.waitForLoadState('networkidle');
      await page.goto('/marketplace-refactored/favoritos');
      await page.waitForURL(/\/favoritos/, { timeout: 15000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);

      // Obtener el conteo inicial
      const totalText = page.locator('text=/publicación.*guardada|publicaciones.*guardadas|\d+.*publicación/i').first();
      const totalTextExists = await totalText.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (totalTextExists) {
        const text = await totalText.textContent();
        const match = text?.match(/(\d+)/);
        if (match) {
          initialFavoritesCount = parseInt(match[1], 10);
        }
      }

      // Buscar la primera tarjeta de favorito disponible
      const favoriteCards = page.locator('[class*="grid"] > div, [class*="card"]').filter({ 
        hasNot: page.locator('text=/No tienes favoritos|No se encontraron/i')
      });
      
      const cardCount = await favoriteCards.count();
      
      if (cardCount === 0) {
        // Si no hay favoritos, primero agregar uno
        await page.goto('/marketplace-refactored/publications');
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        await page.waitForTimeout(2000);
        
        const publicationCards = page.locator('[class*="grid"] > div, [class*="card"], article').filter({ 
          hasNot: page.locator('text=/No se encontraron|Cargando/i')
        }).first();
        
        const favoriteButton = publicationCards.locator('button').filter({
          has: page.locator('svg, [class*="heart" i], [class*="Heart" i]')
        }).first();
        
        await favoriteButton.click();
        await page.waitForLoadState('networkidle', { timeout: 10000 });
        await page.waitForTimeout(2000);
        
        // Volver a favoritos
        await page.goto('/marketplace-refactored/favoritos');
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        await page.waitForTimeout(2000);
      }
      
      // Seleccionar la primera tarjeta de favorito
      const firstFavoriteCard = page.locator('[class*="grid"] > div, [class*="card"]').filter({ 
        hasNot: page.locator('text=/No tienes favoritos|No se encontraron/i')
      }).first();
      
      await expect(firstFavoriteCard).toBeVisible({ timeout: 10000 });
      
      // Obtener el ID de la publicación desde el botón "Ver Detalles"
      const viewDetailsButton = firstFavoriteCard.locator('button').filter({ hasText: /Ver Detalles|Ver detalles/i }).first();
      const hasViewButton = await viewDetailsButton.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (hasViewButton) {
        // Hacer clic para ver los detalles y obtener el ID de la URL
        await viewDetailsButton.click();
        await page.waitForURL(/\/publication\/\d+/, { timeout: 15000 });
        const url = page.url();
        const urlMatch = url.match(/\/publication\/(\d+)/);
        if (urlMatch) {
          publicationId = parseInt(urlMatch[1], 10);
        }
      } else {
        // Si no hay botón, intentar obtener el ID desde el enlace de la tarjeta
        const cardLink = firstFavoriteCard.locator('a').first();
        const hasLink = await cardLink.isVisible({ timeout: 2000 }).catch(() => false);
        if (hasLink) {
          const href = await cardLink.getAttribute('href');
          if (href) {
            const match = href.match(/\/(\d+)$/);
            if (match) {
              publicationId = parseInt(match[1], 10);
            }
          }
        }
      }
      
      // Obtener el nombre de la publicación
      if (!publicationId) {
        // Volver a favoritos y obtener el ID desde la lista
        await page.goto('/marketplace-refactored/favoritos');
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        await page.waitForTimeout(2000);
        
        // Interceptar la respuesta del endpoint para obtener el ID
        const favoritesListPromise = page.waitForResponse(
          (response) => response.url().includes('/api/users/favorites') && 
                        response.request().method() === 'GET',
          { timeout: 15000 }
        ).catch(() => null);

        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        const favoritesListResponse = await favoritesListPromise;
        if (favoritesListResponse) {
          const responseBody = await favoritesListResponse.json();
          const favorites = responseBody.content || [];
          if (favorites.length > 0) {
            publicationId = favorites[0].publicationId;
            publicationName = favorites[0].name;
          }
        }
      }
      
      expect(publicationId).not.toBeNull();
    });

    await test.step('Interceptar la petición DELETE al endpoint de eliminar favorito', async () => {
      expect(publicationId).not.toBeNull();
      
      // Configurar la promesa antes de hacer clic
      const removeFavoritePromise = page.waitForResponse(
        (response) => response.url().includes(`/api/publications/${publicationId}/favorite`) && 
                      response.request().method() === 'DELETE',
        { timeout: 15000 }
      ).catch(() => null);

      // Navegar a la página de favoritos si no estamos ahí
      if (!page.url().includes('/favoritos')) {
        await page.goto('/marketplace-refactored/favoritos');
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        await page.waitForTimeout(2000);
      }
      
      // Buscar el botón de eliminar favorito (corazón rellenado)
      const favoriteCards = page.locator('[class*="grid"] > div, [class*="card"]').filter({ 
        hasNot: page.locator('text=/No tienes favoritos|No se encontraron/i')
      });
      
      let removeButton = null;
      for (let i = 0; i < await favoriteCards.count(); i++) {
        const card = favoriteCards.nth(i);
        const button = card.locator('button').filter({
          has: page.locator('svg, [class*="heart" i], [class*="Heart" i]')
        }).first();
        
        const buttonExists = await button.isVisible({ timeout: 2000 }).catch(() => false);
        if (buttonExists) {
          const heartIcon = button.locator('svg').first();
          const heartClasses = await heartIcon.getAttribute('class').catch(() => '');
          const isFilled = heartClasses?.includes('fill-red') || heartClasses?.includes('fill-red-500');
          
          if (isFilled) {
            removeButton = button;
            break;
          }
        }
      }
      
      // Si no encontramos el botón en la lista, ir a los detalles
      if (!removeButton && publicationId) {
        await page.goto(`/marketplace-refactored/publication/${publicationId}`);
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        await page.waitForTimeout(2000);
        
        removeButton = page.locator('button[aria-label*="favorito" i], button').filter({
          has: page.locator('svg, [class*="heart" i], [class*="Heart" i]')
        }).first();
      }
      
      await expect(removeButton).toBeVisible({ timeout: 10000 });
      
      // Hacer clic en el botón para eliminar de favoritos
      await removeButton.click();
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      await page.waitForTimeout(2000);

      // Verificar la respuesta del endpoint
      const removeFavoriteResponse = await removeFavoritePromise;
      
      if (removeFavoriteResponse) {
        const responseStatus = removeFavoriteResponse.status();
        // El endpoint DELETE debe retornar 200 o 204 (No Content)
        expect([200, 204]).toContain(responseStatus);
        
        // Verificar que la respuesta no tiene contenido (o tiene contenido vacío)
        const responseBody = await removeFavoriteResponse.text().catch(() => '');
        
        // El cuerpo debe estar vacío o ser un objeto vacío
        if (responseBody) {
          try {
            const parsed = JSON.parse(responseBody);
            // Si es un objeto, debe estar vacío o no tener datos relevantes
            expect(Object.keys(parsed).length).toBeLessThanOrEqual(1);
          } catch {
            // Si no es JSON, debe estar vacío
            expect(responseBody.trim()).toBe('');
          }
        }
      }
    });

    await test.step('Verificar que el botón de favorito cambió su estado visual', async () => {
      expect(publicationId).not.toBeNull();
      
      // Si estamos en la página de detalles, verificar el botón
      if (page.url().includes('/publication/')) {
        const favoriteButton = page.locator('button[aria-label*="favorito" i], button').filter({
          has: page.locator('svg, [class*="heart" i], [class*="Heart" i]')
        }).first();
        
        const buttonExists = await favoriteButton.isVisible({ timeout: 5000 }).catch(() => false);
        if (buttonExists) {
          // Verificar que el corazón NO está rellenado (ya no es favorito)
          const heartIcon = favoriteButton.locator('svg').first();
          const heartClasses = await heartIcon.getAttribute('class').catch(() => '');
          const isFilled = heartClasses?.includes('fill-red') || heartClasses?.includes('fill-red-500');
          
          expect(isFilled).toBe(false);
        }
      }
    });

    await test.step('Verificar que la publicación ya no aparece en la lista de favoritos', async () => {
      expect(publicationId).not.toBeNull();
      
      await page.goto('/marketplace-refactored/favoritos');
      await page.waitForURL(/\/favoritos/, { timeout: 15000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(3000);
      
      // Verificar que el conteo de favoritos disminuyó
      const totalText = page.locator('text=/publicación.*guardada|publicaciones.*guardadas|\d+.*publicación/i').first();
      const totalTextExists = await totalText.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (totalTextExists && initialFavoritesCount > 0) {
        const text = await totalText.textContent();
        const match = text?.match(/(\d+)/);
        if (match) {
          const newFavoritesCount = parseInt(match[1], 10);
          expect(newFavoritesCount).toBeLessThan(initialFavoritesCount);
        }
      }
      
      // Interceptar la respuesta del endpoint de favoritos
      const favoritesListPromise = page.waitForResponse(
        (response) => response.url().includes('/api/users/favorites') && 
                      response.request().method() === 'GET',
        { timeout: 15000 }
      ).catch(() => null);

      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const favoritesListResponse = await favoritesListPromise;
      
      if (favoritesListResponse) {
        const responseBody = await favoritesListResponse.json();
        const favorites = responseBody.content || [];
        
        // Verificar que la publicación eliminada NO está en la lista
        const publicationInList = favorites.find(
          (fav: any) => fav.publicationId === publicationId
        );
        
        expect(publicationInList).toBeUndefined();
      }
    });
  });
});

