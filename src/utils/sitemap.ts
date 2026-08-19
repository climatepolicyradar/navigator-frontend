import type { MetadataRoute } from "next";

/**
 * Serialises sitemap entries to a sitemaps.org urlset document.
 *
 * This mirrors the output Next produces for app router `sitemap.ts` files
 * (see next/dist/build/webpack/loaders/metadata/resolve-route-data.js) so that
 * moving our sitemaps to the pages router does not change what crawlers see.
 * Only the fields we actually use are supported - no images, videos or alternates.
 */
export const toSitemapXml = (entries: MetadataRoute.Sitemap): string => {
  let content = "";
  content += '<?xml version="1.0" encoding="UTF-8"?>\n';
  content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const entry of entries) {
    content += "<url>\n";
    content += `<loc>${entry.url}</loc>\n`;
    if (entry.lastModified) {
      const serializedDate = entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified;
      content += `<lastmod>${serializedDate}</lastmod>\n`;
    }
    if (entry.changeFrequency) {
      content += `<changefreq>${entry.changeFrequency}</changefreq>\n`;
    }
    if (typeof entry.priority === "number") {
      content += `<priority>${entry.priority}</priority>\n`;
    }
    content += "</url>\n";
  }

  content += "</urlset>\n";
  return content;
};
