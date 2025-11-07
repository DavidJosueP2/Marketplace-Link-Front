import { defineConfig, devices } from '@playwright/test';

try {
  const dotenv = require('dotenv');
  dotenv.config();
} catch {
}

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
    baseURL: process.env.VITE_FRONTEND_URL || 'http://localhost:5174',

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

  webServer: {
    command: 'npm run dev',
    url: process.env.VITE_FRONTEND_URL || 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
});