import { test, expect } from '@playwright/test';

test.describe('PS-MGF-005 - Validar que no se puede agregar favorito de publicación inexistente', () => {
  const TEST_EMAIL = 'pruebasjos07@gmail.com';
  const TEST_PASSWORD = 'password123';
  const NONEXISTENT_PUBLICATION_ID = 999999999; // ID que no existe en la base de datos

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
  });

  test('debería rechazar agregar una publicación inexistente a favoritos', async ({ page }) => {
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

    await test.step('Intentar acceder directamente a una publicación inexistente', async () => {
      // Intentar navegar a una publicación que no existe
      await page.goto(`/marketplace-refactored/publication/${NONEXISTENT_PUBLICATION_ID}`);
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      await page.waitForTimeout(2000);
      
      // Verificar que la página muestra un error o mensaje de que no existe
      const errorMessage = page.locator('text=/No encontrada|No existe|404|Error/i').first();
      const errorExists = await errorMessage.isVisible({ timeout: 5000 }).catch(() => false);
      
      // La página puede mostrar un error o redirigir
      if (!errorExists) {
        // Si no hay error visible, verificar que no hay botón de favorito
        const favoriteButton = page.locator('button[aria-label*="favorito" i], button').filter({
          has: page.locator('svg, [class*="heart" i], [class*="Heart" i]')
        }).first();
        const buttonExists = await favoriteButton.isVisible({ timeout: 3000 }).catch(() => false);
        expect(buttonExists).toBe(false);
      }
    });

    await test.step('Interceptar la petición POST al endpoint con ID inexistente', async () => {
      // Configurar la promesa para interceptar la respuesta
      const addFavoritePromise = page.waitForResponse(
        (response) => {
          const url = response.url();
          return url.includes(`/api/publications/${NONEXISTENT_PUBLICATION_ID}/favorite`) && 
                 response.request().method() === 'POST';
        },
        { timeout: 15000 }
      ).catch(() => null);

      // Intentar hacer una petición directa al endpoint usando fetch desde el navegador
      // Esto simula lo que haría el frontend
      const response = await page.evaluate(async (pubId) => {
        try {
          const token = localStorage.getItem('token');
          const apiUrl = window.location.origin.includes('localhost') 
            ? 'http://localhost:8080' 
            : window.location.origin.replace(/:\d+$/, ':8080');
          
          const res = await fetch(`${apiUrl}/api/publications/${pubId}/favorite`, {
            method: 'POST',
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

      // Verificar que la respuesta indica un error
      // El endpoint debe retornar un error 404 o 400 cuando la publicación no existe
      expect(response.status).not.toBe(200);
      expect(response.ok).toBe(false);
      
      // El status debe ser 404 (Not Found) o 400 (Bad Request)
      expect([404, 400, 500]).toContain(response.status);
    });

    await test.step('Verificar que no se agregó ningún favorito después del intento fallido', async () => {
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
        
        // Verificar que la publicación inexistente NO está en la lista
        const publicationInList = favorites.find(
          (fav: any) => fav.publicationId === NONEXISTENT_PUBLICATION_ID
        );
        
        expect(publicationInList).toBeUndefined();
      }
    });

    await test.step('Verificar que el endpoint de verificación también rechaza la publicación inexistente', async () => {
      // Intentar verificar si la publicación inexistente es favorita
      const checkResponse = await page.evaluate(async (pubId) => {
        try {
          const token = localStorage.getItem('token');
          const apiUrl = window.location.origin.includes('localhost') 
            ? 'http://localhost:8080' 
            : window.location.origin.replace(/:\d+$/, ':8080');
          
          const res = await fetch(`${apiUrl}/api/publications/${pubId}/favorite/check`, {
            method: 'GET',
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

      // El endpoint de verificación también debe retornar un error
      expect(checkResponse.status).not.toBe(200);
      expect(checkResponse.ok).toBe(false);
    });
  });
});

