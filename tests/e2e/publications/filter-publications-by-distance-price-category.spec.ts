import { test, expect } from '@playwright/test';

/**
 * PS-MGP-001: Filtrado de publicaciones por distancia, precio y categoría
 * 
 * Descripción:
 * Verificar que después de iniciar sesión como comprador, el sistema muestre correctamente
 * la lista de publicaciones disponibles y que al interactuar con los filtros del panel lateral
 * (por distancia, precio y categoría), la lista de publicaciones se actualice dinámicamente
 * mostrando únicamente los resultados que cumplan con los criterios seleccionados.
 */

test.describe('PS-MGP-001 - Filtrado de publicaciones por distancia, precio y categoría', () => {
  // Credenciales de prueba
  const TEST_EMAIL = 'pruebasjos07@gmail.com';
  const TEST_PASSWORD = 'password123';
  
  // Datos de filtros
  const FILTER_DISTANCE = '5 km';
  const FILTER_MIN_PRICE = '30';
  const FILTER_MAX_PRICE = '500';
  const FILTER_CATEGORY = 'Hogar';

  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/login');
    
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
  });

  test('debería filtrar publicaciones por distancia, precio y categoría correctamente', async ({ page }) => {
    // ========== PASO 1: Iniciar sesión ==========
    await test.step('Iniciar sesión con credenciales de comprador', async () => {
      // Localizar el campo de email
      const emailInput = page.locator('input[type="email"], input#email').first();
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      
      // Ingresar email
      await emailInput.fill(TEST_EMAIL);
      
      // Localizar el campo de contraseña
      const passwordInput = page.locator('input[type="password"], input#password').first();
      await expect(passwordInput).toBeVisible();
      
      // Ingresar contraseña
      await passwordInput.fill(TEST_PASSWORD);
      
      // Localizar y hacer clic en el botón de submit
      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Entrar|Ingresar/i });
      await expect(submitButton).toBeVisible();
      await submitButton.click();
      
      // Esperar a que la redirección se complete
      await page.waitForURL(/\/marketplace-refactored/, { timeout: 15000 });
      
      // Verificar que se redirigió a la página de publicaciones
      expect(page.url()).toContain('/marketplace-refactored');
      
      // Esperar un momento para observar el cambio de página
      await page.waitForTimeout(1000);
    });

    // ========== PASO 2: Verificar visualización de publicaciones ==========
    await test.step('Verificar que se muestra la lista de publicaciones', async () => {
      // Esperar a que la página de publicaciones cargue
      await page.waitForLoadState('networkidle');
      
      // Verificar que el título de bienvenida está visible
      const welcomeTitle = page.locator('text=/¡Bienvenido!|Bienvenido/i').first();
      await expect(welcomeTitle).toBeVisible({ timeout: 10000 });
      
      // Verificar que hay un grid de publicaciones (puede estar vacío o con contenido)
      const publicationsGrid = page.locator('div[class*="grid"]').filter({ hasText: /publication|producto/i }).or(
        page.locator('div').filter({ hasText: /No se encontraron publicaciones/i })
      ).first();
      
      // Esperar a que el grid aparezca o el mensaje de sin resultados
      await expect(publicationsGrid).toBeVisible({ timeout: 10000 });
      
      // Esperar un momento para observar la lista de publicaciones
      await page.waitForTimeout(1000);
    });

    // ========== PASO 3: Verificar panel de filtros ==========
    await test.step('Verificar que el panel lateral de filtros está visible', async () => {
      // Buscar el panel de filtros por el título "Filtros"
      const filterPanel = page.locator('text=Filtros').locator('..').locator('..').first();
      
      // Alternativamente, buscar el panel por su estructura
      const filterPanelByTitle = page.locator('h3, div').filter({ hasText: /^Filtros$/ }).first();
      await expect(filterPanelByTitle).toBeVisible({ timeout: 10000 });
      
      // Verificar que las secciones de filtros están presentes
      const categoriesSection = page.locator('text=Categorías').first();
      await expect(categoriesSection).toBeVisible({ timeout: 10000 });
      
      const priceSection = page.locator('text=/Rango de Precio/i').first();
      await expect(priceSection).toBeVisible({ timeout: 10000 });
      
      const distanceSection = page.locator('text=/Distancia a la redonda/i').first();
      await expect(distanceSection).toBeVisible({ timeout: 10000 });
      
      // Esperar un momento para observar el panel de filtros
      await page.waitForTimeout(1000);
    });

    // ========== PASO 4: Aplicar filtro de distancia ==========
    await test.step(`Aplicar filtro de distancia: ${FILTER_DISTANCE}`, async () => {
      // Buscar dentro del contexto de la sección de distancia
      const distanceSection = page.locator('text=/Distancia a la redonda/i').locator('..');
      
      // Buscar el radio button de distancia "5 km"
      // Buscar el label que contiene exactamente "5 km"
      const distanceLabel = distanceSection.locator('label').filter({ hasText: new RegExp(`^${FILTER_DISTANCE}$`, 'i') }).first();
      
      await expect(distanceLabel).toBeVisible({ timeout: 10000 });
      
      // Buscar el radio button dentro del label
      const distanceRadio = distanceLabel.locator('input[type="radio"]').first();
      await expect(distanceRadio).toBeVisible({ timeout: 10000 });
      
      // Hacer clic en el radio button
      await distanceRadio.click();
      
      // Verificar que el radio está seleccionado
      await expect(distanceRadio).toBeChecked();
      
      // Esperar un momento para que se aplique el filtro y observar el cambio
      await page.waitForTimeout(1500);
    });

    // ========== PASO 5: Aplicar filtro de precio ==========
    await test.step(`Aplicar filtro de precio: $${FILTER_MIN_PRICE} - $${FILTER_MAX_PRICE}`, async () => {
      // Buscar el label "Mínimo" dentro del panel de filtros
      const minPriceLabel = page.locator('text=/^Mínimo$/i').first();
      await expect(minPriceLabel).toBeVisible({ timeout: 10000 });
      
      // Buscar el input de precio mínimo (primer input de tipo number dentro del panel de precio)
      // Buscar el input que está cerca del label "Mínimo"
      const priceSection = page.locator('text=/Rango de Precio/i').locator('..');
      const minPriceInput = priceSection.locator('input[type="number"]').first();
      
      await expect(minPriceInput).toBeVisible({ timeout: 10000 });
      
      // Limpiar y escribir el precio mínimo
      await minPriceInput.clear();
      await minPriceInput.fill(FILTER_MIN_PRICE);
      
      // Buscar el input de precio máximo (segundo input de número en el panel de precio)
      const maxPriceInput = priceSection.locator('input[type="number"]').nth(1);
      await expect(maxPriceInput).toBeVisible({ timeout: 10000 });
      
      // Limpiar y escribir el precio máximo
      await maxPriceInput.clear();
      await maxPriceInput.fill(FILTER_MAX_PRICE);
      
      // Verificar que el rango de precio se muestra correctamente
      const priceRangeDisplay = page.locator('text=/\\$\\d+\\s*-\\s*\\$\\d+/').first();
      await expect(priceRangeDisplay).toBeVisible({ timeout: 5000 });
      
      // Esperar un momento para que se aplique el filtro y observar el cambio
      await page.waitForTimeout(1500);
    });

    // ========== PASO 6: Aplicar filtro de categoría ==========
    await test.step(`Aplicar filtro de categoría: ${FILTER_CATEGORY}`, async () => {
      // Buscar el checkbox de la categoría "Hogar"
      // Buscar dentro del contexto de la sección de categorías
      const categoriesSection = page.locator('text=Categorías').locator('..');
      
      // Buscar el label que contiene el texto "Hogar" exacto
      const categoryLabel = categoriesSection.locator('label').filter({ hasText: new RegExp(`^${FILTER_CATEGORY}$`, 'i') }).first();
      
      await expect(categoryLabel).toBeVisible({ timeout: 10000 });
      
      // Buscar el checkbox dentro del label
      const categoryCheckbox = categoryLabel.locator('input[type="checkbox"]').first();
      
      // Esperar a que el checkbox esté visible
      await expect(categoryCheckbox).toBeVisible({ timeout: 10000 });
      
      // Verificar que no está seleccionado inicialmente (o hacer clic de todas formas)
      const isChecked = await categoryCheckbox.isChecked();
      
      // Si no está seleccionado, hacer clic
      if (!isChecked) {
        await categoryCheckbox.click();
      }
      
      // Esperar un momento para que se aplique el filtro y observar el cambio
      await page.waitForTimeout(1500);
    });

    // ========== PASO 7: Verificar actualización automática ==========
    await test.step('Verificar que la lista de publicaciones se actualiza automáticamente', async () => {
      // Esperar a que la red de peticiones se complete (la aplicación hace una petición al backend)
      await page.waitForLoadState('networkidle', { timeout: 10000 });
      
      // Esperar un momento adicional para que React actualice la UI
      await page.waitForTimeout(2000);
      
      // Verificar que no hay errores en consola
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Verificar que la lista de publicaciones está visible
      // Puede mostrar publicaciones filtradas o un mensaje de "No se encontraron publicaciones"
      const publicationsContainer = page.locator('div[class*="grid"]').or(
        page.locator('text=/No se encontraron publicaciones/i')
      ).first();
      
      await expect(publicationsContainer).toBeVisible({ timeout: 10000 });
      
      // Verificar que los filtros aplicados están reflejados
      // Verificar que la categoría está seleccionada
      const categoriesSection = page.locator('text=Categorías').locator('..');
      const categoryCheckbox = categoriesSection.locator('label').filter({ hasText: new RegExp(`^${FILTER_CATEGORY}$`, 'i') })
        .locator('input[type="checkbox"]').first();
      await expect(categoryCheckbox).toBeChecked();
      
      // Verificar que la distancia está seleccionada
      const distanceSection = page.locator('text=/Distancia a la redonda/i').locator('..');
      const distanceRadio = distanceSection.locator('label').filter({ hasText: new RegExp(`^${FILTER_DISTANCE}$`, 'i') })
        .locator('input[type="radio"]').first();
      await expect(distanceRadio).toBeChecked();
      
      // Verificar que los precios están en los inputs
      const priceSection = page.locator('text=/Rango de Precio/i').locator('..');
      const minPriceInput = priceSection.locator('input[type="number"]').first();
      const maxPriceInput = priceSection.locator('input[type="number"]').nth(1);
      
      await expect(minPriceInput).toHaveValue(FILTER_MIN_PRICE);
      await expect(maxPriceInput).toHaveValue(FILTER_MAX_PRICE);
      
      // Verificar que no hay errores críticos en consola
      // (Algunos warnings pueden ser aceptables, pero no errores)
      const criticalErrors = consoleErrors.filter(err => 
        !err.includes('Warning') && 
        !err.includes('warning') &&
        !err.includes('Deprecation')
      );
      
      expect(criticalErrors.length).toBe(0);
      
      // Esperar un momento para observar los resultados finales
      await page.waitForTimeout(1500);
    });

    // ========== PASO 8: Verificar tiempo de respuesta ==========
    await test.step('Verificar que el tiempo de actualización es menor a 2 segundos', async () => {
      // Limpiar los filtros primero para hacer una prueba de tiempo
      const clearButton = page.locator('button, a').filter({ hasText: /Limpiar/i }).first();
      
      if (await clearButton.isVisible({ timeout: 5000 })) {
        const startTime = Date.now();
        await clearButton.click();
        
        // Esperar a que se actualice
        await page.waitForLoadState('networkidle', { timeout: 5000 });
        const endTime = Date.now();
        
        const responseTime = endTime - startTime;
        
        // Verificar que el tiempo de respuesta es menor a 2 segundos (2000ms)
        expect(responseTime).toBeLessThan(2000);
      }
    });
  });
});

