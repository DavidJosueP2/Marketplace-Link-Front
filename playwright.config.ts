import { defineConfig, devices } from '@playwright/test';


// URL contra la que se ejecutan los tests E2E.
// Configurable con la variable de entorno E2E_BASE_URL; por defecto, el dev server local.
const FRONTEND_URL = process.env.E2E_BASE_URL || 'http://localhost:5174';

export default defineConfig({
  testDir: './tests/e2e',

  timeout: 30 * 1000,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  use: {
    baseURL: FRONTEND_URL,

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    trace: 'on-first-retry',

    actionTimeout: 10 * 1000,

    navigationTimeout: 30 * 1000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});