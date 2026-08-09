import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 30_000,
  expect: { timeout: 8_000 },
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4176",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: "node server.mjs",
    url: "http://127.0.0.1:4176",
    env: { ...process.env, LEARNING_IDEAS_PORT: "4176" },
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  }
});
