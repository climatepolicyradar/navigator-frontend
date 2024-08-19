const { defineConfig } = require("cypress");

// load the environment variables from the local .env file
require("dotenv").config();

module.exports = defineConfig({
  // Viewport for "MacBook 13"
  viewportWidth: 1280,
  viewportHeight: 800,
  chromeWebSecurity: false,
  screenshotOnRunFailure: true,
  video: false,
  e2e: {
    baseUrl: "http://localhost:3000",
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      require("./cypress/plugins/index.js")(on, config);
    },
    env: {
      THEME: process.env.THEME,
      APP_CONFIG_TOKEN: "test_token",
    },
    specPattern: `cypress/e2e/${process.env.THEME}/**/*.{js,jsx,ts,tsx}`,
    excludeSpecPattern: ["**/1-getting-started/*.js", "**/2-advanced-examples/*.js"],
  },
});
