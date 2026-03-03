/**
 * Robots-related constants for crawl/index control.
 *
 * Keep this file boring and explicit: it is used to control how search
 * engines and other automated agents interact with the site.
 */

/**
 * Slugs that must not be crawled or indexed.
 *
 * These map to dynamic routes like `/document/[id]` and `/documents/[id]`.
 */
export const ROBOTS_BLOCKED_SLUGS = [
  "carbon-markets-and-greenhouse-gasses-regulations-2023_3f7f",
  "carbon-markets-and-greenhouse-gasses-regulations-2023_db2d",
] as const;

/**
 * Routes we do not want crawled, regardless of environment.
 *
 * Will block the above slugs for both documents and family pages, regardless of whether the slug only exists for one.
 */
export const ROBOTS_DISALLOW_ROUTES = ["/_search", ...ROBOTS_BLOCKED_SLUGS.flatMap((slug) => [`/document/${slug}`, `/documents/${slug}`])] as const;

/**
 * Standard header value to request no indexing of a response.
 */
export const X_ROBOTS_TAG_NOINDEX_VALUE = "noindex, nofollow";
