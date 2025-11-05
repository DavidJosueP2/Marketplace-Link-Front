import { defineConfig, devices } from '@playwright/test';

// Cargar variables de entorno (si dotenv está disponible)
// Nota: dotenv se puede instalar con: npm install -D dotenv
try {
  // Usar require para compatibilidad
  const dotenv = require('dotenv');
  dotenv.config();
} catch {
  // dotenv no está instalado, continuar sin él
  // Las variables de entorno se pueden configurar directamente en el sistema
}

export default defineConfig({
  testDir: './tests/e2e',
  
  // Timeout para cada prueba
  timeout: 30 * 1000,
  
  // Número de reintentos en caso de fallo
  retries: process.env.CI ? 2 : 0,
  
  // Número de workers para ejecutar pruebas en paralelo
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  
  // Configuración compartida para todos los proyectos
  use: {
    // URL base del frontend desde variable de entorno
    baseURL: process.env.VITE_FRONTEND_URL || 'http://localhost:5174',
    
    // Capturar screenshot solo en fallos
    screenshot: 'only-on-failure',
    
    // Capturar video solo en fallos
    video: 'retain-on-failure',
    
    // Capturar trace solo en el primer intento
    trace: 'on-first-retry',
    
    // Timeout para acciones
    actionTimeout: 10 * 1000,
    
    // Esperar a que la navegación se complete
    navigationTimeout: 30 * 1000,
  },

  // Configuración de proyectos (navegadores)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Puedes agregar más navegadores si lo necesitas
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Servidor web para desarrollo (opcional, si quieres que Playwright inicie el servidor)
  webServer: {
    command: 'npm run dev',
    url: process.env.VITE_FRONTEND_URL || 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});

