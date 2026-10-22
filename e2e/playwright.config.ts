import { defineConfig, devices } from '@playwright/test'

const apiBase = process.env.E2E_API_BASE_URL ?? 'http://localhost:3000'
const webBase = process.env.E2E_WEB_BASE_URL ?? 'http://localhost:5173'

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: process.env.CI ? 2 : 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: webBase,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_SKIP_WEB_SERVER
    ? undefined
    : [
        {
          command: 'npm run dev',
          cwd: '../Backend',
          url: `${apiBase}/health`,
          reuseExistingServer: true,
          timeout: 120_000,
        },
        {
          command: 'npm run dev',
          cwd: '../Frontend',
          url: webBase,
          reuseExistingServer: true,
          timeout: 120_000,
        },
      ],
})
