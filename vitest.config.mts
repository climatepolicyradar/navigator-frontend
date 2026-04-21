import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/.trunk/**", "**/tests/**/*.spec.ts", "**/themes/**"],
    setupFiles: ["./tests/setup.ts"],
    reporters: process.env.CI ? ["default", ["junit", { outputFile: "./vitest.xml" }]] : ["verbose"],
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    allowOnly: !process.env.CI,
  },
});
