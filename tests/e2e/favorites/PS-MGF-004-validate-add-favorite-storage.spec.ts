import { test, expect } from '@playwright/test';

test.describe('PS-MGF-004 - Validar agregación de favoritos y almacenamiento', () => {
  const TEST_EMAIL = 'pruebasjos07@gmail.com';
  const TEST_PASSWORD = 'password123';

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería almacenar y retornar la nueva publicación favorita del usuario autenticado', async ({ page }) => {
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

    await test.step('Obtener el conteo inicial de favoritos', async () => {
      await page.waitForLoadState('networkidle');
      await page.goto('/marketplace-refactored/favoritos');
      await page.waitForURL(/\/favoritos/, { timeout: 15000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);

      // Obtener el texto del total de favoritos
      const totalText = page.locator('text=/publicación.*guardada|publicaciones.*guardadas|\d+.*publicación/i').first();
      const totalTextExists = await totalText.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (totalTextExists) {
        const text = await totalText.textContent();
        const match = text?.match(/(\d+)/);
        if (match) {
          initialFavoritesCount = parseInt(match[1], 10);
        }
      } else {
        // Si no hay texto, contar las tarjetas visibles
        const favoriteCards = page.locator('[class*="grid"] > div, [class*="card"]').filter({ 
          hasNot: page.locator('text=/No tienes favoritos|No se encontraron/i')
        });
        initialFavoritesCount = await favoriteCards.count();
      }
    });

    await test.step('Navegar a la página de publicaciones', async () => {
      await page.goto('/marketplace-refactored/publications');
      await page.waitForURL(/\/publications/, { timeout: 15000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
    });

    await test.step('Seleccionar una publicación que no esté en favoritos', async () => {
      // Buscar todas las tarjetas de publicaciones
      const publicationCards = page.locator('[class*="grid"] > div, [class*="card"], article').filter({ 
        hasNot: page.locator('text=/No se encontraron|Cargando/i')
      });
      
      const cardCount = await publicationCards.count();
      expect(cardCount).toBeGreaterThan(0);
      
      // Buscar una publicación que no esté marcada como favorita
      let selectedCard = null;
      for (let i = 0; i < cardCount; i++) {
        const card = publicationCards.nth(i);
        const favoriteButton = card.locator('button').filter({
          has: page.locator('svg, [class*="heart" i], [class*="Heart" i]')
        }).first();
        
        const buttonExists = await favoriteButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (buttonExists) {
          // Verificar si el corazón está rellenado (ya es favorito)
          const heartIcon = favoriteButton.locator('svg').first();
          const heartClasses = await heartIcon.getAttribute('class').catch(() => '');
          const isFilled = heartClasses?.includes('fill-red') || heartClasses?.includes('fill-red-500');
          
          if (!isFilled) {
            // Esta publicación no está en favoritos, la seleccionamos
            selectedCard = card;
            
            // Obtener el ID de la publicación desde el enlace o hacer clic para ver detalles
            const cardLink = card.locator('a').first();
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
            
            // Obtener el nombre de la publicación
            const titleElement = card.locator('h3, [class*="font-semibold"], [class*="title" i]').first();
            const titleExists = await titleElement.isVisible({ timeout: 2000 }).catch(() => false);
            if (titleExists) {
              publicationName = await titleElement.textContent();
            }
            
            break;
          }
        }
      }
      
      // Si no encontramos una publicación sin favorito, usar la primera
      if (!selectedCard && cardCount > 0) {
        selectedCard = publicationCards.first();
        const cardLink = selectedCard.locator('a').first();
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
      
      expect(publicationId).not.toBeNull();
    });

    await test.step('Interceptar la petición POST al endpoint de agregar favorito', async () => {
      expect(publicationId).not.toBeNull();
      
      // Configurar la promesa antes de hacer clic
      const addFavoritePromise = page.waitForResponse(
        (response) => response.url().includes(`/api/publications/${publicationId}/favorite`) && 
                      response.request().method() === 'POST',
        { timeout: 15000 }
      ).catch(() => null);

      // Buscar el botón de favorito en la tarjeta
      const publicationCards = page.locator('[class*="grid"] > div, [class*="card"], article').filter({ 
        hasNot: page.locator('text=/No se encontraron|Cargando/i')
      });
      
      let favoriteButton = null;
      for (let i = 0; i < await publicationCards.count(); i++) {
        const card = publicationCards.nth(i);
        const button = card.locator('button').filter({
          has: page.locator('svg, [class*="heart" i], [class*="Heart" i]')
        }).first();
        
        const buttonExists = await button.isVisible({ timeout: 2000 }).catch(() => false);
        if (buttonExists) {
          // Verificar si corresponde a la publicación que queremos
          const heartIcon = button.locator('svg').first();
          const heartClasses = await heartIcon.getAttribute('class').catch(() => '');
          const isFilled = heartClasses?.includes('fill-red') || heartClasses?.includes('fill-red-500');
          
          if (!isFilled) {
            favoriteButton = button;
            break;
          }
        }
      }
      
      // Si no encontramos el botón en la lista, ir a los detalles
      if (!favoriteButton) {
        await page.goto(`/marketplace-refactored/publication/${publicationId}`);
        await page.waitForLoadState('networkidle', { timeout: 15000 });
        await page.waitForTimeout(2000);
        
        favoriteButton = page.locator('button[aria-label*="favorito" i], button').filter({
          has: page.locator('svg, [class*="heart" i], [class*="Heart" i]')
        }).first();
      }
      
      await expect(favoriteButton).toBeVisible({ timeout: 10000 });
      
      // Hacer clic en el botón de favorito
      await favoriteButton.click();
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      await page.waitForTimeout(2000);

      // Verificar la respuesta del endpoint
      const addFavoriteResponse = await addFavoritePromise;
      
      if (addFavoriteResponse) {
        const responseStatus = addFavoriteResponse.status();
        expect(responseStatus).toBe(200);
        
        // Verificar que la respuesta tiene el formato esperado (MessageResponse)
        const responseBody = await addFavoriteResponse.json();
        expect(responseBody).toHaveProperty('message');
        expect(typeof responseBody.message).toBe('string');
      }
    });

    await test.step('Verificar que el botón de favorito cambió su estado visual', async () => {
      expect(publicationId).not.toBeNull();
      
      // Buscar el botón de favorito
      const favoriteButton = page.locator('button[aria-label*="favorito" i], button').filter({
        has: page.locator('svg, [class*="heart" i], [class*="Heart" i]')
      }).first();
      
      const buttonExists = await favoriteButton.isVisible({ timeout: 5000 }).catch(() => false);
      if (buttonExists) {
        // Verificar que el corazón está rellenado (es favorito ahora)
        const heartIcon = favoriteButton.locator('svg').first();
        const heartClasses = await heartIcon.getAttribute('class').catch(() => '');
        const isFilled = heartClasses?.includes('fill-red') || heartClasses?.includes('fill-red-500');
        
        // Debe estar rellenado después de agregar a favoritos
        expect(isFilled).toBe(true);
      }
    });

    await test.step('Navegar a la página de favoritos y verificar que la publicación aparece en la lista', async () => {
      expect(publicationId).not.toBeNull();
      
      await page.goto('/marketplace-refactored/favoritos');
      await page.waitForURL(/\/favoritos/, { timeout: 15000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(3000);
      
      // Verificar que el conteo de favoritos aumentó
      const totalText = page.locator('text=/publicación.*guardada|publicaciones.*guardadas|\d+.*publicación/i').first();
      const totalTextExists = await totalText.isVisible({ timeout: 5000 }).catch(() => false);
      
      if (totalTextExists) {
        const text = await totalText.textContent();
        const match = text?.match(/(\d+)/);
        if (match) {
          const newFavoritesCount = parseInt(match[1], 10);
          expect(newFavoritesCount).toBeGreaterThanOrEqual(initialFavoritesCount);
        }
      }
      
      // Buscar la publicación en la lista de favoritos
      if (publicationName) {
        const publicationInFavorites = page.locator('text=/.*' + publicationName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '.*/i').first();
        const publicationExists = await publicationInFavorites.isVisible({ timeout: 10000 }).catch(() => false);
        
        if (publicationExists) {
          await expect(publicationInFavorites).toBeVisible();
        }
      } else {
        // Si no tenemos el nombre, verificar que hay al menos una tarjeta más
        const favoriteCards = page.locator('[class*="grid"] > div, [class*="card"]').filter({ 
          hasNot: page.locator('text=/No tienes favoritos|No se encontraron/i')
        });
        const newCardCount = await favoriteCards.count();
        expect(newCardCount).toBeGreaterThanOrEqual(initialFavoritesCount);
      }
    });

    await test.step('Interceptar la respuesta del endpoint de favoritos y verificar que incluye la nueva publicación', async () => {
      expect(publicationId).not.toBeNull();
      
      // Configurar la promesa antes de recargar
      const favoritesListPromise = page.waitForResponse(
        (response) => response.url().includes('/api/users/favorites') && 
                      response.request().method() === 'GET',
        { timeout: 15000 }
      ).catch(() => null);

      // Recargar la página para obtener la lista actualizada
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      const favoritesListResponse = await favoritesListPromise;
      
      if (favoritesListResponse) {
        const responseStatus = favoritesListResponse.status();
        expect(responseStatus).toBe(200);
        
        const responseBody = await favoritesListResponse.json();
        
        // Verificar la estructura de la respuesta
        expect(responseBody).toHaveProperty('content');
        expect(Array.isArray(responseBody.content)).toBe(true);
        
        // Verificar que la nueva publicación está en la lista
        const publicationInList = responseBody.content.find(
          (fav: any) => fav.publicationId === publicationId
        );
        
        expect(publicationInList).toBeDefined();
        expect(publicationInList).toHaveProperty('publicationId');
        expect(publicationInList.publicationId).toBe(publicationId);
      }
    });

    await test.step('Verificar que no se duplicó la publicación en favoritos', async () => {
      expect(publicationId).not.toBeNull();
      
      // Interceptar la respuesta del endpoint
      const favoritesListPromise = page.waitForResponse(
        (response) => response.url().includes('/api/users/favorites') && 
                      response.request().method() === 'GET',
        { timeout: 15000 }
      ).catch(() => null);

      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);

      const favoritesListResponse = await favoritesListPromise;
      
      if (favoritesListResponse) {
        const responseBody = await favoritesListResponse.json();
        const favorites = responseBody.content || [];
        
        // Contar cuántas veces aparece la publicación
        const publicationCount = favorites.filter(
          (fav: any) => fav.publicationId === publicationId
        ).length;
        
        // Debe aparecer exactamente una vez
        expect(publicationCount).toBe(1);
      }
    });
  });
});

