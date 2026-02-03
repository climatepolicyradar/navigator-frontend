import path from "path";
import { fileURLToPath } from "url";

import globals from "globals";

import js from "@eslint/js";
import nextPackage from "@next/eslint-plugin-next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { flatConfig: nextFlatConfig } = nextPackage;
import tsParser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import storybookPlugin from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const tseslintConfigs = tseslint.configs;

const eslintConfig = [
  {
    ignores: [
      "**/.next",
      "**/dist",
      "**/build",
      "**/node_modules",
      "**/*.config.js",
      "**/*.config.ts",
      "**/*.config.mjs",
      "**/eslint.config.mjs",
      "**/vite.config.{js,mts}",
      "**/tailwind.config.js",
      "postcss.config.js",
      ".storybook/**",
      ".size-limit.js",
      "lighthouserc.*.js",
      "snapshots.js",
    ],
  },
  {
    settings: {
      react: { version: "detect" },
    },
  },
  ...(Array.isArray(js.configs.recommended) ? js.configs.recommended : [js.configs.recommended]),
  ...(Array.isArray(tseslintConfigs.recommended) ? tseslintConfigs.recommended : [tseslintConfigs.recommended]),
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  reactHooksPlugin.configs["recommended-latest"],
  jsxA11yPlugin.flatConfigs.recommended,
  nextFlatConfig.recommended,
  nextFlatConfig.coreWebVitals,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2025,
      },
      parser: tsParser,
      parserOptions: {
        // projectService discovers tsconfig per-file; avoids "file not in project"
        // when e.g. Trunk uses temp paths. See typescript-eslint’s own eslint.config.
        projectService: true,
        tsconfigRootDir: __dirname,
        warnOnUnsupportedTypeScriptVersion: true,
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-html-link-for-pages": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-unknown-property": "off",
      "react/prop-types": "warn",
      "jsx-a11y/alt-text": ["warn", { elements: ["img"], img: ["Image"] }],
      "jsx-a11y/media-has-caption": "warn",
      eqeqeq: "warn",
      "no-console": "warn",
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@**/**",
              group: "external",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: false,
          },
        },
      ],
      "import/no-unresolved": "error",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/no-absolute-path": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unsafe-function-type": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "warn",
      "no-var": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-wrapper-object-types": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },
  ...(Array.isArray(storybookPlugin.configs["flat/recommended"])
    ? storybookPlugin.configs["flat/recommended"]
    : [storybookPlugin.configs["flat/recommended"]]),
  ...(Array.isArray(eslintConfigPrettier) ? eslintConfigPrettier : [eslintConfigPrettier]),
];

export default eslintConfig;
