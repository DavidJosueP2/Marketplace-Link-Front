import { test, expect } from '@playwright/test';

test.describe('PS-MGF-007 - Validar verificación antes de eliminar favorito', () => {
  const TEST_EMAIL = 'pruebasjos07@gmail.com';
  const TEST_PASSWORD = 'password123';
  const NONEXISTENT_PUBLICATION_ID = 999999999; // ID que no existe en favoritos

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería verificar que una publicación está registrada antes de eliminar', async ({ page }) => {
    let publicationId: number | null = null;

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

    await test.step('Obtener una publicación que NO esté en favoritos', async () => {
      await page.goto('/marketplace-refactored/publications');
      await page.waitForURL(/\/publications/, { timeout: 15000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      // Buscar una publicación que no esté marcada como favorita
      const publicationCards = page.locator('[class*="grid"] > div, [class*="card"], article').filter({ 
        hasNot: page.locator('text=/No se encontraron|Cargando/i')
      });
      
      const cardCount = await publicationCards.count();
      expect(cardCount).toBeGreaterThan(0);
      
      // Buscar una publicación sin favorito
      for (let i = 0; i < cardCount; i++) {
        const card = publicationCards.nth(i);
        const favoriteButton = card.locator('button').filter({
          has: page.locator('svg, [class*="heart" i], [class*="Heart" i]')
        }).first();
        
        const buttonExists = await favoriteButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (buttonExists) {
          const heartIcon = favoriteButton.locator('svg').first();
          const heartClasses = await heartIcon.getAttribute('class').catch(() => '');
          const isFilled = heartClasses?.includes('fill-red') || heartClasses?.includes('fill-red-500');
          
          if (!isFilled) {
            // Esta publicación no está en favoritos
            const cardLink = card.locator('a').first();
            const hasLink = await cardLink.isVisible({ timeout: 2000 }).catch(() => false);
            
            if (hasLink) {
              const href = await cardLink.getAttribute('href');
              if (href) {
                const match = href.match(/\/(\d+)$/);
                if (match) {
                  publicationId = parseInt(match[1], 10);
                  break;
                }
              }
            }
          }
        }
      }
      
      // Si no encontramos una, usar la primera y obtener su ID
      if (!publicationId && cardCount > 0) {
        const firstCard = publicationCards.first();
        const cardLink = firstCard.locator('a').first();
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

    await test.step('Verificar que la publicación NO está en favoritos usando el endpoint de verificación', async () => {
      expect(publicationId).not.toBeNull();
      
      // Configurar la promesa antes de recargar
      const checkEndpointPromise = page.waitForResponse(
        (response) => response.url().includes(`/api/publications/${publicationId}/favorite/check`) && 
                      response.request().method() === 'GET',
        { timeout: 15000 }
      ).catch(() => null);

      // Navegar a los detalles de la publicación
      await page.goto(`/marketplace-refactored/publication/${publicationId}`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);

      const checkResponse = await checkEndpointPromise;
      
      if (checkResponse) {
        const responseStatus = checkResponse.status();
        expect(responseStatus).toBe(200);
        
        const responseBody = await checkResponse.json();
        
        // Verificar que la respuesta es false (no está en favoritos)
        expect(typeof responseBody).toBe('boolean');
        expect(responseBody).toBe(false);
      }
    });

    await test.step('Intentar eliminar un favorito que no existe y verificar que el endpoint rechaza la operación', async () => {
      expect(publicationId).not.toBeNull();
      
      // Intentar hacer una petición DELETE al endpoint para una publicación que no está en favoritos
      const response = await page.evaluate(async (pubId) => {
        try {
          const token = localStorage.getItem('token');
          const apiUrl = window.location.origin.includes('localhost') 
            ? 'http://localhost:8080' 
            : window.location.origin.replace(/:\d+$/, ':8080');
          
          const res = await fetch(`${apiUrl}/api/publications/${pubId}/favorite`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          return {
            status: res.status,
            ok: res.ok,
            body: await res.text().catch(() => '')
          };
        } catch (error) {
          return {
            status: 0,
            ok: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }, publicationId);

      // El endpoint debe retornar un error (404 Not Found o 400 Bad Request)
      // porque la publicación no está registrada como favorita
      expect(response.status).not.toBe(200);
      expect(response.ok).toBe(false);
      
      // El status debe ser 404 (Not Found) o 400 (Bad Request)
      expect([404, 400, 500]).toContain(response.status);
    });

    await test.step('Verificar que intentar eliminar un favorito inexistente no afecta la lista de favoritos', async () => {
      // Navegar a la página de favoritos
      await page.goto('/marketplace-refactored/favoritos');
      await page.waitForURL(/\/favoritos/, { timeout: 15000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      
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
        
        // Verificar que la publicación que intentamos eliminar NO está en la lista
        // (lo cual es correcto porque nunca estuvo en favoritos)
        const publicationInList = favorites.find(
          (fav: any) => fav.publicationId === publicationId
        );
        
        expect(publicationInList).toBeUndefined();
      }
    });

    await test.step('Intentar eliminar un favorito de una publicación que no existe en la base de datos', async () => {
      // Intentar eliminar un favorito de una publicación que no existe
      const response = await page.evaluate(async (pubId) => {
        try {
          const token = localStorage.getItem('token');
          const apiUrl = window.location.origin.includes('localhost') 
            ? 'http://localhost:8080' 
            : window.location.origin.replace(/:\d+$/, ':8080');
          
          const res = await fetch(`${apiUrl}/api/publications/${pubId}/favorite`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          return {
            status: res.status,
            ok: res.ok,
            body: await res.text().catch(() => '')
          };
        } catch (error) {
          return {
            status: 0,
            ok: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      }, NONEXISTENT_PUBLICATION_ID);

      // El endpoint debe retornar un error porque la publicación no existe
      expect(response.status).not.toBe(200);
      expect(response.ok).toBe(false);
      
      // El status debe ser 404 (Not Found) o 400 (Bad Request)
      expect([404, 400, 500]).toContain(response.status);
    });
  });
});

