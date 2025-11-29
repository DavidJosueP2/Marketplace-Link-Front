import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.TEST_AUTH_ADMIN_EMAIL ?? 'admin@example.com';
const ADMIN_PASSWORD = process.env.TEST_AUTH_ADMIN_PASSWORD ?? 'admin123';
const TOKEN_STORAGE_KEY = 'mp_access_token';
const LOGIN_PATH = '/login';

const VALID_STATES = ['ACTIVE', 'BLOCKED', 'INACTIVE', 'PENDING', 'PENDING_VERIFICATION'];

const SENSITIVE_FIELDS = [
  'password',
  'hash',
  'token',
  'accessToken',
  'refreshToken',
  'secret',
  'privateKey',
  'salt',
];

const REQUIRED_FIELDS = ['id', 'username', 'email', 'roles', 'state'];

test.describe('PS-MGU-001 — Consulta de usuarios: consistencia de esquema y estados', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
  });

  test('debería devolver solo los campos permitidos y estados válidos sin información sensible', async ({
    page,
  }) => {
    await test.step('Iniciar sesión con usuario administrador', async () => {
      await page.goto(LOGIN_PATH);
      await page.waitForLoadState('domcontentloaded');

      const emailInput = page.locator('input[type="email"], input#email').first();
      await expect(emailInput).toBeVisible({ timeout: 10000 });
      await emailInput.fill(ADMIN_EMAIL);

      const passwordInput = page.locator('input[type="password"], input#password').first();
      await expect(passwordInput).toBeVisible({ timeout: 10000 });
      await passwordInput.fill(ADMIN_PASSWORD);

      const submitButton = page
        .locator('button[type="submit"]')
        .filter({ hasText: /Entrar|Ingresar|Iniciar sesión/i });
      await expect(submitButton).toBeVisible();
      await submitButton.click();

      await page.waitForURL(/\/marketplace-refactored/, { timeout: 15000 });
      await page.waitForLoadState('networkidle');

      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token).toBeTruthy();
    });

    let users: any[] = [];

    await test.step('Navegar a la página de usuarios', async () => {
      // Navegar a la página de usuarios para verificar acceso
      await page.goto('/marketplace-refactored/usuarios');
      await page.waitForLoadState('networkidle');

      // Esperar a que se cargue la tabla de usuarios
      const usersTable = page.locator('table, [role="table"]').first();
      await expect(usersTable).toBeVisible({ timeout: 15000 });
    });

    await test.step('Realizar solicitud GET al endpoint de usuarios sin filtros', async () => {
      // Obtener el token de autenticación
      const token = await page.evaluate((key) => window.localStorage.getItem(key), TOKEN_STORAGE_KEY);
      expect(token).toBeTruthy();

      // Obtener la URL base del backend
      // El backend puede estar en un puerto diferente o en la misma URL
      const frontendURL = await page.evaluate(() => window.location.origin);
      // Intentar obtener la URL del backend desde la variable de entorno o usar el puerto 8080
      const backendURL = process.env.VITE_API_URL || 'http://localhost:8080';
      const apiURL = `${backendURL}/api/users?query=&role=&state=&page=0&size=10`;

      // Hacer la petición directa al endpoint sin filtros
      const response = await page.request.get(apiURL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      expect(response.status()).toBe(200);

      const responseData = await response.json();
      expect(responseData).toBeDefined();

      // Debug: mostrar la estructura de la respuesta
      console.log('URL de la petición:', apiURL);
      console.log('Status de la respuesta:', response.status());
            // La respuesta puede ser un array directo o un objeto paginado
      if (Array.isArray(responseData)) {
        users = responseData;
      } else if (responseData.content && Array.isArray(responseData.content)) {
        users = responseData.content;
      } else if (responseData.data && Array.isArray(responseData.data)) {
        users = responseData.data;
      } else if (responseData.users && Array.isArray(responseData.users)) {
        users = responseData.users;
      } else {
        // Si no encontramos usuarios, intentar extraer cualquier array del objeto
        const allKeys = Object.keys(responseData);
        console.log('Claves en la respuesta:', allKeys);
        for (const key of allKeys) {
          if (Array.isArray(responseData[key])) {
            users = responseData[key];
            console.log(`Usuarios encontrados en la clave: ${key}`);
            break;
          }
        }
      }

      // Si la respuesta está vacía, verificar al menos que la estructura sea correcta
      if (users.length === 0) {
        console.log('Advertencia: No se encontraron usuarios en la respuesta');
        
        // Validar que la estructura de la respuesta paginada sea correcta
        if (responseData.empty !== undefined) {
          expect(responseData.empty).toBe(true);
          expect(responseData.totalElements).toBe(0);
          expect(responseData.content).toBeDefined();
          expect(Array.isArray(responseData.content)).toBe(true);
          
          // Verificar que no haya campos sensibles en la respuesta vacía
          const responseKeys = Object.keys(responseData).map(k => k.toLowerCase());
          for (const sensitiveField of SENSITIVE_FIELDS) {
            expect(responseKeys.some(k => k.includes(sensitiveField.toLowerCase()))).toBeFalsy();
          }
          
          console.log('La respuesta está vacía pero tiene la estructura correcta');
          // Si no hay usuarios, no podemos continuar con las validaciones de usuarios
          // pero la estructura de la respuesta es válida
          return;
        } else {
          // Si no es una respuesta paginada, debería ser un array vacío
          expect(Array.isArray(responseData)).toBe(true);
          console.log('La respuesta es un array vacío (estructura válida)');
          return;
        }
      }

      // Si hay usuarios, continuar con las validaciones
      if (users.length === 0) {
        console.log('No hay usuarios para validar, pero la estructura de la respuesta es correcta');
        // La prueba pasa porque la estructura es correcta, aunque no haya usuarios
        return;
      }
    });

    await test.step('Revisar la estructura de cada registro devuelto', async () => {
      expect(users.length).toBeGreaterThan(0);
      for (const user of users) {
        // Verificar que cada usuario tenga los campos requeridos
        for (const field of REQUIRED_FIELDS) {
          // El campo 'state' puede estar como 'accountStatus' en el backend
          if (field === 'state') {
            const hasState = user.hasOwnProperty('state') || user.hasOwnProperty('accountStatus');
            expect(hasState, `El usuario ${user.id} debe tener el campo 'state' o 'accountStatus'`).toBeTruthy();
          } else {
            expect(
              user.hasOwnProperty(field),
              `El usuario ${user.id} debe tener el campo '${field}'`
            ).toBeTruthy();
          }
        }

        // Verificar tipos de datos
        expect(typeof user.id).toBe('number');
        expect(typeof user.username).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(Array.isArray(user.roles)).toBeTruthy();

        // Verificar que 'state' o 'accountStatus' sea un string válido
        const state = user.state || user.accountStatus;
        expect(typeof state).toBe('string');
      }
    });

    await test.step('Verificar que los roles y estados correspondan a valores válidos', async () => {
      for (const user of users) {
        // Verificar estructura de roles
        expect(Array.isArray(user.roles)).toBeTruthy();
        for (const role of user.roles) {
          expect(role).toBeDefined();
          // El rol puede ser un string o un objeto con 'id' y 'name'
          if (typeof role === 'object') {
            expect(role.name).toBeDefined();
            expect(typeof role.name).toBe('string');
            expect(role.name.startsWith('ROLE_')).toBeTruthy();
          } else {
            expect(typeof role).toBe('string');
            expect(role.startsWith('ROLE_')).toBeTruthy();
          }
        }

        // Verificar que el estado sea válido
        const state = user.state || user.accountStatus;
        expect(
          VALID_STATES.includes(state),
          `El usuario ${user.id} tiene un estado inválido: ${state}`
        ).toBeTruthy();
      }
    });

    await test.step('Confirmar que no se exponen datos sensibles en la respuesta', async () => {
      for (const user of users) {
        const userKeys = Object.keys(user).map((key) => key.toLowerCase());

        for (const sensitiveField of SENSITIVE_FIELDS) {
          const hasSensitiveField = userKeys.some(
            (key) => key.includes(sensitiveField.toLowerCase()) || key === sensitiveField.toLowerCase()
          );
          expect(
            hasSensitiveField,
            `El usuario ${user.id} no debe contener el campo sensible '${sensitiveField}'`
          ).toBeFalsy();
        }

        // Verificar que no haya valores que parezcan contraseñas o tokens
        const userValues = JSON.stringify(user).toLowerCase();
        // Verificar que no haya hashes bcrypt (empiezan con $2a$, $2b$, $2y$, etc.)
        const bcryptPattern = /\$2[aby]\$/;
        expect(bcryptPattern.test(userValues)).toBeFalsy();
      }
    });
  });
});

