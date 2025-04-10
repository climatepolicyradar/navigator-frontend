// import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-plugin-prettier/recommended";
import tsParser from "@typescript-eslint/parser";
import pluginNext from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
const compat = new FlatCompat({ baseDirectory: _dirname });

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],

    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-html-link-for-pages": "off",
      eqeqeq: "warn",
      "no-console": "warn",

      // TODO: Remove in next PR
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "warn",
      "no-var": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  }),
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
  },
];

export default eslintConfig;
