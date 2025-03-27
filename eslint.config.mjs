import { fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: [
      "**/dist",
      "**/build",
      "**/node_modules",
      "**/*.config.js",
      "**/*.config.mjs",
      "**/eslint.config.mjs",
      "**/vite.config.ts",
      "tailwind.config.js",
      "postcss.config.js",
      "**/*.js",
      ".storybook/*",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      "@next/next": nextPlugin,
      import: fixupPluginRules(importPlugin),
      "react-hooks": reactHooks,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        AudioWorkletGlobalScope: "readonly",
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

    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
      react: {
        version: "detect",
      },
      node: {
        extensions: [".ts", ".tsx", ".d.ts"],
      },
    },

    rules: {
      // Extend Next.js core web vitals rules
      ...nextPlugin.configs["core-web-vitals"].rules,

      // TypeScript specific rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      // Next.js specific rules
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",

      // React generic rules
      "react/no-unescaped-entities": "off",

      // React hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Import rules with custom grouping
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

      // General best practices
      eqeqeq: "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "prefer-const": "error",
    },
  },
];
