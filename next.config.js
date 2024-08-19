const fs = require("fs");

const configureRedirects = (theme) => {
  const redirectRules = JSON.parse(fs.readFileSync(`./themes/${theme}/redirects.json`, "utf-8"));

  return redirectRules;
};

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  // TODO: confirm this is necessary
  env: {
    THEME: process.env.THEME,
    NEXT_PUBLIC_APP_TOKEN: process.env.APP_CONFIG_TOKEN,
  },
  // Supports dynamic component imports
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  // Loads in theme styles
  sassOptions: {
    additionalData: `@import "./themes/${process.env.THEME}/styles/styles.scss";`,
  },
  // Redirects
  redirects: async () => {
    return configureRedirects(process.env.THEME);
  },
  // Translations
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  // TypeScript
  pageExtensions: ["tsx", "ts"],
  // Cache control
  headers: async () => {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Any path that is not one of the dynamic paths
      {
        source: "/((?!document|documents|geographies).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
