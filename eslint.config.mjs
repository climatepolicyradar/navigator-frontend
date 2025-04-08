import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import tsParser from "@typescript-eslint/parser";
import next from "@next/eslint-plugin-next";

export default defineConfig([
  {
    ignores: [
      "**/dist",
      "**/build",
      "**/node_modules",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/eslint.config.mjs",
      "**/vite.config.{js,mts}",
      "tailwind.config.js",
      "postcss.config.js",
      ".storybook/preview.ts",
      ".storybook/main.ts",
    ],
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      js: js,
      "@typescript-eslint": tseslint.configs.strict,
      prettier: prettier,
      "react-hooks": pluginReact.configs.flat.recommended,
      "@next/next": next,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2025,
      },
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-html-link-for-pages": "off",
      eqeqeq: "warn",
      "no-console": "warn",
    },
  },
]);
