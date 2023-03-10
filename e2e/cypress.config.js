const { defineConfig } = require('cypress');

// load the environment variables from the local .env file
require('dotenv').config();
// Just for debugging missing env vars
// console.log(process.env)

module.exports = defineConfig({
  // Viewport for "MacBook 13"
  viewportWidth: 1280,
  viewportHeight: 800,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      require('./cypress/plugins/index.js')(on, config);

      config.env = config.env || {};
      config.env.LOGIN_NAME = process.env.LOGIN_NAME;
      config.env.LOGIN_PW = process.env.LOGIN_PW;
      config.env.API_HOST = process.env.API_HOST;
      return config;
    },
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    excludeSpecPattern: [
      '**/1-getting-started/*.js',
      '**/2-advanced-examples/*.js',
    ],
  },
});
