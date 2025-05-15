// import { defineConfig } from "eslint/config";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);
const compat = new FlatCompat({ baseDirectory: _dirname });

const eslintConfig = [
  ...compat.config({
    // TODO: There's a bug in next/core-web-vitals at the moment, so we need to comment out its rules
    // https://github.com/microsoft/rushstack/issues/4965 & https://github.com/microsoft/rushstack/issues/5049
    // extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    extends: ["next/typescript", "plugin:react/recommended", "plugin:react-hooks/recommended-legacy", "prettier"],

    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-html-link-for-pages": "off",
      eqeqeq: "warn",
      "no-console": "warn",
      // NextJS does this for us so we can disable this rule.
      "react/react-in-jsx-scope": "off",

      // TODO: Remove in next PR - this PR is just to migrate our existing config
      // and in the next we'll actually resolve the errors below that we've suppressed.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "warn",
      "no-var": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "react/prop-types": "warn",
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
      "**/tailwind.config.js",
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
