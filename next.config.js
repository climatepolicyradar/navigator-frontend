const defaultRedirects = [
  // Remove www from all URLs
  {
    source: "/:path*",
    has: [{ type: "header", key: "x-forwarded-host", value: "www.climate-laws.org" }],
    destination: "https://climate-laws.org/:path*",
    permanent: true,
  },
  {
    source: "/:path*",
    has: [{ type: "header", key: "x-forwarded-host", value: "www-cclw.dev.climatepolicyradar.org" }],
    destination: "https://cclw.dev.climatepolicyradar.org/:path*",
    permanent: true,
  },
  {
    source: "/auth/:id*",
    destination: "/",
    permanent: true,
  },
  {
    source: "/account",
    destination: "/",
    permanent: true,
  },
  {
    source: "/users/:id*",
    destination: "/",
    permanent: true,
  },
  {
    source: "/litigation/:id*",
    destination: "/",
    permanent: false, // will become a page eventually
  },
  // CCLW REDIRECTS
  {
    source: "/geography/:slug/laws",
    destination: "/geographies/:slug",
    permanent: true,
  },
  {
    source: "/geography/:slug/policies",
    destination: "/geographies/:slug",
    permanent: true,
  },
  {
    source: "/geography/:slug/litigation_cases",
    destination: "/geographies/:slug",
    permanent: true,
  },
  {
    source: "/geography/:slug/climate_targets/:type*",
    destination: "/geographies/:slug",
    permanent: true,
  },
  {
    source: "/cclow",
    destination: "/",
    permanent: true,
  },
  {
    source: "/cclow/:slug*",
    destination: "/:slug*",
    permanent: true,
  },
];

/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  pageExtensions: ["tsx", "ts"],
  redirects: async () => {
    return defaultRedirects;
  },
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
