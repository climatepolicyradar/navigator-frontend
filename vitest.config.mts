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
    reporters: [process.env.CI ? ["junit", { outputFile: "./vitest.xml" }] : "verbose"],
  },
  // Configure Vite to be more permissive with dynamic imports
  optimizeDeps: {
    include: [
      // Pre-bundle theme modules to avoid dynamic import issues
      "themes/cpr/**/*",
      "themes/cclw/**/*",
      "themes/mcf/**/*",
      "themes/ccc/**/*",
    ],
  },
  // build: {
  //   rollupOptions: {
  //     onwarn(warning, warn) {
  //       // Suppress only dynamic import warnings
  //       if (warning.code === 'DYNAMIC_IMPORT_ASSERTIONS' ||
  //           warning.message.includes('dynamic-import-vars')) {
  //         return;
  //       }
  //       warn(warning);
  //     },
  //   },
  // },
});
