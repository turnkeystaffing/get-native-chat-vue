import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './perf',
  testMatch: '**/*.spec.ts',
  timeout: 120_000,
  use: {
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: 'yarn docs:dev --port 5174',
    port: 5174,
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
