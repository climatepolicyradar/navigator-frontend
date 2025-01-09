import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  verbose: true,

  moduleNameMapper: {
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@helpers/(.*)$": "<rootDir>/src/helpers/$1",
    "^tailwind.config.js$": "<rootDir>/themes/mcf/tailwind.config.js",
    "^@mcf/(.*)$": "<rootDir>/themes/mcf/$1",
    "^@cclw/(.*)$": "<rootDir>/themes/cclw/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    // Add other aliases if needed
  },
};

export default config;
