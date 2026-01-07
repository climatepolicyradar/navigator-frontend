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
  },
  // Supports dynamic component imports
  // webpack(config) {
  //   config.experiments = { ...config.experiments, topLevelAwait: true };
  //   config.watchOptions = { // Enable polling for file changes - useful for docker
  //     poll: 1000, // Check for changes every second
  //     aggregateTimeout: 300, // Delay before rebuilding
  //   };
  //   return config;
  // },
  // Redirects
  redirects: async () => {
    return configureRedirects(process.env.THEME);
  },
  // TypeScript
  pageExtensions: ["tsx", "ts"],
  // Cache control
  headers: async () => {
    const env = process.env.NODE_ENV;

    /**
     * We see a whole lot of problems arising when caching files and webpack's
     * HMR - so it's easier just to disable this in dev.
     */
    if (env !== "production") {
      return [];
    }
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
  devIndicators: false,
  experimental: {},
  /**
   * this is used for instrumentation.ts
   * @see: https://github.com/vercel/next.js/issues/65324
   */
  serverExternalPackages: ["@vercel/otel"],
  output: "standalone",
};

module.exports = nextConfig;
