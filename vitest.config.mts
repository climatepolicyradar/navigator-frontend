import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

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
    exclude: ["**/node_modules/**", "**/.trunk/**", "**/tests/**"],
    reporters: [["junit", { outputFile: "./junit.xml" }]],
  },
});
