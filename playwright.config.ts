import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    launchOptions: { channel: "chrome" },
    viewport: { width: 390, height: 844 },
  },
  reporter: "list",
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: { NEXT_PUBLIC_BASE_PATH: "", NEXT_TELEMETRY_DISABLED: "1" },
    timeout: 120000,
  },
});
