import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "tailwind.config.js": "/themes/mcf/tailwind.config.js",
    },
  },
  plugins: [tsconfigPaths(), react()],
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/.trunk/**", "**/tests/**/*.spec.ts", "**/themes/**"],
    setupFiles: ["./tests/setup.js"],
    reporters: process.env.CI ? ["default", ["junit", { outputFile: "./vitest.xml" }]] : ["verbose"],
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    allowOnly: !process.env.CI,
    browser: {
      expect: {
        toMatchScreenshot: {
          comparatorName: "pixelmatch",
          comparatorOptions: {
            // 0-1, how different can colors be?
            threshold: 0.2,
            // 1% of pixels can differ
            allowedMismatchedPixelRatio: 0.01,
          },
        },
      },
    },
  },
});
