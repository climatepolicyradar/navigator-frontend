import { toSitemapXml } from "./sitemap";

describe("toSitemapXml", () => {
  it("returns an empty urlset when there are no entries", () => {
    expect(toSitemapXml([])).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n'
    );
  });

  it("serialises all supported fields, converting Date to ISO", () => {
    const xml = toSitemapXml([
      {
        url: "https://app.climatepolicyradar.org/search",
        lastModified: new Date("2026-01-02T03:04:05.000Z"),
        changeFrequency: "daily",
        priority: 1,
      },
    ]);

    expect(xml).toBe(
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        "<url>\n" +
        "<loc>https://app.climatepolicyradar.org/search</loc>\n" +
        "<lastmod>2026-01-02T03:04:05.000Z</lastmod>\n" +
        "<changefreq>daily</changefreq>\n" +
        "<priority>1</priority>\n" +
        "</url>\n" +
        "</urlset>\n"
    );
  });

  it("passes through a string lastModified unchanged", () => {
    expect(toSitemapXml([{ url: "https://example.com", lastModified: "2026-01-02" }])).toContain("<lastmod>2026-01-02</lastmod>\n");
  });

  it("emits a zero priority rather than omitting it", () => {
    expect(toSitemapXml([{ url: "https://example.com", priority: 0 }])).toContain("<priority>0</priority>\n");
  });

  it("omits optional fields that are not set", () => {
    const xml = toSitemapXml([{ url: "https://example.com" }]);
    expect(xml).toContain("<url>\n<loc>https://example.com</loc>\n</url>\n");
  });
});
