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
  /**
   * this is used for instrumentation.ts
   * @see: https://github.com/vercel/next.js/issues/65324
   */
  serverExternalPackages: [
    "@vercel/otel",
    "@opentelemetry/api",
    "@opentelemetry/sdk-trace-node",
    "@opentelemetry/instrumentation",
    "@opentelemetry/api-logs",
  ],
  /*
   * See Next docs for more info: https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
   * standalone output is optimised for running the app in a container
   */
  output: "standalone",
  /**
   * This URL has the assets published to if via S3.
   * @see: https://github.com/climatepolicyradar/navigator-frontend/blob/93bfc4070244d3901c58fc18cf2772fbdc90b1e1/infra/__main__.py#L433-L447
   * @see: https://nextjs.org/docs/app/api-reference/config/next-config-js/assetPrefix
   */
  assetPrefix: process.env.NEXT_STATIC_ENABLED === "true" ? `https://${process.env.THEME}.production.climatepolicyradar.org` : undefined,
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);
