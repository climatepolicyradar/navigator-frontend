import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier/recommended";
import tsParser from "@typescript-eslint/parser";
import pluginNext from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";

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
    files: ["**/*.{mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      js,
      tseslint,
      pluginReact,
      reactHooks,
      pluginNext,
      prettier,
    },
    extends: [
      "js/recommended",
      tseslint.configs.strict,
      //   "plugin:react/recommended",
      //   "plugin:react-hooks/recommended",
      //   "plugin:next/recommended",
      //   "plugin:next/eslint-plugin-next/recommended",
      //   "plugin:prettier/recommended",
    ],
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
