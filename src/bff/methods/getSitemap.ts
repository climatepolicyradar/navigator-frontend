import { MetadataRoute } from "next";

import { fetchLabelsTaxonomy, fetchSitemapDocuments, TTaxonomyNode } from "@/api/search";
import { ROBOTS_BLOCKED_SLUGS } from "@/constants/robots";
import themeConfig from "@/themes/config";
import routes from "@/themes/routes.json";
import { getGeographySlug } from "@/utils/geography";
import { getAppUrlForJSONLD } from "@/utils/json-ld/helpers";

type TSitemapResponse = {
  data: MetadataRoute.Sitemap;
  errors: Error[];
};

/**
 * Subdivision pages 404 on a theme that has the feature off (@see pages/geographies/[id]),
 * so the sitemap must not offer them there. A crawler is anonymous, so the theme config
 * decides this rather than the per-request feature flags.
 */
const geographyTypes = (): string[] => (themeConfig.features.subdivisions ? ["country", "subdivision"] : ["country"]);

/**
 * What sitemaps.org allows in one file, and what the search endpoint stops at.
 *
 * A crawler rejects the whole document when it is over, rather than reading what fits,
 * so going over costs every url rather than the tail. Splitting into a sitemap index is
 * the fix when a theme gets this big.
 */
const SITEMAP_URL_LIMIT = 50_000;

/**
 * Flatten the geography labels this app holds documents for into page slugs.
 *
 * A label with no documents comes back with `count: 0` rather than being left out,
 * and listing one would put a page in the sitemap that this app answers with a 404.
 */
const geographySlugs = (nodes: TTaxonomyNode[]): string[] => {
  const types = geographyTypes();
  const slugs = nodes.flatMap((node): string[] => {
    const childSlugs = geographySlugs(node.children);

    if (node.count === 0 || !types.includes(node.type)) {
      return childSlugs;
    }

    const slug = getGeographySlug(node);
    return slug ? [slug, ...childSlugs] : childSlugs;
  });

  return [...new Set(slugs)];
};

/**
 * Build this app's sitemap from the documents and geographies it can actually serve.
 *
 * Both requests carry the theme's own default search filters, so the sitemap and the
 * app's search describe the same set of documents (@see FUS-913).
 *
 * A failing request costs its section rather than the whole sitemap: a crawler gets a
 * smaller valid document instead of an error, and the failure is returned to be logged.
 */
export const getSitemap = async (): Promise<TSitemapResponse> => {
  const errors: Error[] = [];
  const origin = getAppUrlForJSONLD();
  const apiUrl = process.env.API_URL;

  const [documentsResult, geographiesResult] = await Promise.allSettled([
    fetchSitemapDocuments({ apiUrl }),
    fetchLabelsTaxonomy({ apiUrl, include: geographyTypes().map((type) => `**/${type}::*`) }),
  ]);

  if (!origin) {
    errors.push(new Error("APP_URL is unset, so the sitemap has no origin to build URLs from"));
  }

  let documentsSitemap: MetadataRoute.Sitemap = [];
  if (documentsResult.status === "fulfilled") {
    documentsSitemap = documentsResult.value
      .filter((document) => !ROBOTS_BLOCKED_SLUGS.includes(document.slug as (typeof ROBOTS_BLOCKED_SLUGS)[number]))
      .map((document) => ({
        url: `${origin}/document/${document.slug}`,
        lastModified: document.last_updated_date ?? undefined,
        changeFrequency: "daily" as const,
        priority: 1,
      }));
  } else {
    errors.push(new Error("Failed to fetch sitemap documents", { cause: documentsResult.reason }));
  }

  let geographiesSitemap: MetadataRoute.Sitemap = [];
  if (geographiesResult.status === "fulfilled") {
    geographiesSitemap = geographySlugs(geographiesResult.value).map((slug) => ({
      url: `${origin}/geographies/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.75,
    }));
  } else {
    errors.push(new Error("Failed to fetch sitemap geographies", { cause: geographiesResult.reason }));
  }

  const staticSitemap: MetadataRoute.Sitemap = [
    {
      url: origin,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${origin}/search`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...routes.map((route) => ({
      url: `${origin}/${route.path}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  const data = [...staticSitemap, ...documentsSitemap, ...geographiesSitemap];
  if (data.length > SITEMAP_URL_LIMIT) {
    errors.push(new Error(`Sitemap has ${data.length} urls, over the ${SITEMAP_URL_LIMIT} a crawler accepts, so it needs splitting into an index`));
  }

  return { data, errors };
};
