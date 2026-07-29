import { defineConfig, devices } from "@playwright/test"
import path from "path"

const testDbPath = path.resolve(__dirname, "e2e", "e2e.db").replace(/\\/g, "/")

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  timeout: 60000,
  expect: { timeout: 10000 },

  use: {
    baseURL: "http://localhost:3000",
    trace: process.env.CI ? "on-first-retry" : "retain-on-failure",
    screenshot: "only-on-failure",
  },

  webServer: {
    command: `cd "${__dirname}" && pnpm dev`,
    port: 3000,
    reuseExistingServer: false,
    timeout: 120000,
    env: {
      DATABASE_URL: `file:${testDbPath}`,
      AUTH_SECRET: "e2e-test-secret-do-not-use-in-production",
      AUTH_URL: "http://localhost:3000",
    },
  },

  globalSetup: path.resolve(__dirname, "e2e", "global-setup.ts"),

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
})
