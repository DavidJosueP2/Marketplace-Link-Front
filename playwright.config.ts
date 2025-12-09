import { defineConfig, devices } from '@playwright/test';


const FRONTEND_URL = 'https://mplink-frontend.purplebay-4e22b9c6.westus3.azurecontainerapps.io';

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