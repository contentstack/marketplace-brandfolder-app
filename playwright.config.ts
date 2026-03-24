import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import dotenv from "dotenv";
import { STORAGE_STATE_FILE } from "./tests/e2e/utils/paths";

dotenv.config();

const config: PlaywrightTestConfig = {
  testDir: "./tests/e2e",
  globalSetup: "./global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }]],
  use: {
    storageState: STORAGE_STATE_FILE,
    actionTimeout: 0,
    screenshot: "off",
    video: "off",
    viewport: { width: 1200, height: 720 },
    trace: "on-first-retry",
    baseURL: process.env.APP_HOST_URL,
    launchOptions: {
      logger: {
        isEnabled: () => false,
        log: (name, severity, message) => console.log(`${name}: ${message}`),
      },
    },
  },
  projects: [
    { name: "Chromium", use: { browserName: "chromium" } },
    { name: "safari", use: { ...devices["Desktop Safari"] } },
    { name: "firefox", use: { browserName: "firefox" } },
  ],
};

export default config;
