import { defineConfig, devices } from "@playwright/test";

type TEnvironmentConfig = {
  baseURL: string;
  useWebserver: boolean;
};

const localBaseURL = "http://localhost:3000";

const config: Record<string, TEnvironmentConfig> = {
  development: {
    baseURL: localBaseURL,
    useWebserver: true,
  },
  shipyard: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? localBaseURL,
    useWebserver: false,
  },

  // CPR
  cpr_staging: {
    baseURL: "https://cpr.staging.climatepolicyradar.org",
    useWebserver: false,
  },
  cpr_production: {
    baseURL: "https://app.climatepolicyradar.org",
    useWebserver: false,
  },
  // CCLW
  cclw_staging: {
    baseURL: "https://cclw.staging.climatepolicyradar.org",
    useWebserver: false,
  },
  cclw_production: {
    baseURL: "https://climate-laws.org",
    useWebserver: false,
  },
  // MCF
  mcf_staging: {
    baseURL: "https://mcf.staging.climatepolicyradar.org",
    useWebserver: false,
  },
  mcf_production: {
    baseURL: "https://climateprojectexplorer.org",
    useWebserver: false,
  },
  // CCC
  ccc_staging: {
    baseURL: "https://ccc.staging.climatepolicyradar.org",
    useWebserver: false,
  },
  ccc_production: {
    baseURL: "https://ccc.production.climatepolicyradar.org",
    useWebserver: false,
  },
};
const env = process.env.PLAYWRIGHT_ENV ?? "development";
const envConfig = config[env];

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Attempt to see fewer timeout errors on CI */
  workers: process.env.CI ? 1 : undefined,
  /*
   * timeout is for the entire test, not per request.
   * Set to 60 seconds to accommodate for slower CI environments
   */
  timeout: 60_000,
  /*
   * Reporter to use. See https://playwright.dev/docs/test-reporters
   * The generated XML file is used in merge_to_main and pull_request gitHub workflows
   * junit is used to report to Trunk
   */
  reporter: process.env.CI
    ? [["junit", { outputFile: process.env.THEME ? `test-results-${process.env.THEME}/playwright.xml` : "playwright.xml" }]]
    : "list",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: envConfig.baseURL,
    video: "off",
    screenshot: "off",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /*
   * Run your local dev server before starting the tests *
   * See next docs for more info: https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
   * And playwright docs: https://playwright.dev/docs/test-configuration#web-server
   */
  webServer: envConfig.useWebserver
    ? {
        command: "HOSTNAME=0.0.0.0 PORT=3000 node .next/standalone/server.js",
        url: envConfig.baseURL,
        reuseExistingServer: !process.env.CI,
      }
    : undefined,
});
