import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  verbose: true,

  moduleNameMapper: {
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@mcf/(.*)$": "<rootDir>/themes/mcf/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    // Add other aliases if needed
  },
};

export default config;
