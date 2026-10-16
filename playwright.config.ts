// End-to-end tests as a user: the interface served by Vite, against the local HTTP bridge that
// hosts the service on the Node adapters; plus the launch of the Electron application.
import { defineConfig, devices } from "@playwright/test";

const BRIDGE = 4321;
const RENDERER = 5173;

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  outputDir: "test-results",
  use: {
    baseURL: `http://127.0.0.1:${RENDERER}`,
    screenshot: "on",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: [
    {
      command: `node apps/desktop/scripts/bridge.mjs ${BRIDGE}`,
      url: `http://127.0.0.1:${BRIDGE}/health`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      command: `pnpm --filter @ipe/desktop exec vite --port ${RENDERER} --strictPort --host 127.0.0.1`,
      url: `http://127.0.0.1:${RENDERER}`,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
  projects: [
    { name: "browser", testMatch: /prj\.spec\.ts/ },
    { name: "electron", testMatch: /electron\.spec\.ts/ },
  ],
});
