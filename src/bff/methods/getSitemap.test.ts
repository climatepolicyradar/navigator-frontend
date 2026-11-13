import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchLabelsTaxonomy, fetchSitemapDocuments, TSitemapDocument, TTaxonomyNode } from "@/api/search";
import { ROBOTS_BLOCKED_SLUGS } from "@/constants/robots";
import themeConfig from "@/themes/config";
import routes from "@/themes/routes.json";

import { getSitemap } from "./getSitemap";

vi.mock("@/api/search", () => ({
  fetchSitemapDocuments: vi.fn(),
  fetchLabelsTaxonomy: vi.fn(),
}));

const ORIGIN = "https://app.example.org";

const node = (overrides: Partial<TTaxonomyNode> & Pick<TTaxonomyNode, "id" | "type" | "value">): TTaxonomyNode => ({
  alternative_labels: [],
  count: 1,
  children: [],
  ...overrides,
});

const givenDocuments = (documents: TSitemapDocument[]) => vi.mocked(fetchSitemapDocuments).mockResolvedValue(documents);
const givenGeographies = (nodes: TTaxonomyNode[]) => vi.mocked(fetchLabelsTaxonomy).mockResolvedValue(nodes);

const urls = (sitemap: Awaited<ReturnType<typeof getSitemap>>["data"]): string[] => sitemap.map((entry) => entry.url);

describe("getSitemap", () => {
  const subdivisionsDefault = themeConfig.features.subdivisions;

  beforeEach(() => {
    vi.resetAllMocks();
    process.env.APP_URL = ORIGIN;
    themeConfig.features.subdivisions = subdivisionsDefault;
    givenDocuments([]);
    givenGeographies([]);
  });

  it("lists a family page per document, dated by its last update", async () => {
    givenDocuments([{ slug: "planning-act-2008-1e9d", last_updated_date: "2021-03-05T00:00:00Z" }]);

    const { data, errors } = await getSitemap();

    expect(errors).toEqual([]);
    expect(data).toContainEqual(expect.objectContaining({ url: `${ORIGIN}/document/planning-act-2008-1e9d`, lastModified: "2021-03-05T00:00:00Z" }));
  });

  it("leaves lastmod off a document the API has no date for, rather than inventing today", async () => {
    givenDocuments([{ slug: "undated", last_updated_date: null }]);

    const { data } = await getSitemap();

    const entry = data.find((item) => item.url.endsWith("/document/undated"));
    expect(entry?.lastModified).toBeUndefined();
  });

  it("only lists geographies this app holds documents for", async () => {
    givenGeographies([
      node({ id: "country::FRA", type: "country", value: "France", count: 12 }),
      node({ id: "country::MLT", type: "country", value: "Malta", count: 0 }),
    ]);

    const { data } = await getSitemap();

    expect(urls(data)).toContain(`${ORIGIN}/geographies/france`);
    expect(urls(data)).not.toContain(`${ORIGIN}/geographies/malta`);
  });

  it("finds subdivisions nested under a country, and ignores the region above both", async () => {
    givenGeographies([
      node({
        id: "region::NAC",
        type: "region",
        value: "North America",
        count: 30,
        children: [
          node({
            id: "country::USA",
            type: "country",
            value: "United States",
            count: 20,
            children: [node({ id: "subdivision::US-CA", type: "subdivision", value: "California", count: 4 })],
          }),
        ],
      }),
    ]);

    const { data } = await getSitemap();

    expect(urls(data)).toContain(`${ORIGIN}/geographies/united-states-of-america`);
    expect(urls(data)).toContain(`${ORIGIN}/geographies/us-ca`);
    expect(urls(data)).not.toContain(`${ORIGIN}/geographies/north-america`);
  });

  it("keeps a geography that appears under more than one parent once", async () => {
    const france = node({ id: "country::FRA", type: "country", value: "France", count: 12 });
    givenGeographies([
      node({ id: "region::ECS", type: "region", value: "Europe & Central Asia", children: [france] }),
      node({ id: "region::OTH", type: "region", value: "Other", children: [france] }),
    ]);

    const { data } = await getSitemap();

    expect(urls(data).filter((url) => url === `${ORIGIN}/geographies/france`)).toHaveLength(1);
  });

  it("serves the geographies when the documents request fails, and reports the failure", async () => {
    vi.mocked(fetchSitemapDocuments).mockRejectedValue(new Error("Search API error: 503"));
    givenGeographies([node({ id: "country::FRA", type: "country", value: "France", count: 12 })]);

    const { data, errors } = await getSitemap();

    expect(urls(data)).toContain(`${ORIGIN}/geographies/france`);
    expect(data.some((entry) => entry.url.includes("/document/"))).toBe(false);
    expect(errors).toHaveLength(1);
  });

  it("reports a sitemap over the url limit, which a crawler rejects whole", async () => {
    givenDocuments(Array.from({ length: 50_000 }, (_, index): TSitemapDocument => ({ slug: `document-${index}`, last_updated_date: null })));

    const { errors } = await getSitemap();

    expect(errors.map((error) => error.message)).toContainEqual(expect.stringContaining("over the 50000"));
  });

  it("does not ask for subdivisions on a theme whose subdivision pages 404", async () => {
    themeConfig.features.subdivisions = false;

    await getSitemap();

    expect(vi.mocked(fetchLabelsTaxonomy).mock.calls[0][0].include).toEqual(["**/country::*"]);
  });

  it("leaves out a document robots.txt disallows, so it is not submitted and blocked at once", async () => {
    givenDocuments([
      { slug: ROBOTS_BLOCKED_SLUGS[0], last_updated_date: null },
      { slug: "fine", last_updated_date: null },
    ]);

    const { data } = await getSitemap();

    expect(urls(data)).toContain(`${ORIGIN}/document/fine`);
    expect(urls(data)).not.toContain(`${ORIGIN}/document/${ROBOTS_BLOCKED_SLUGS[0]}`);
  });

  it("lists the home page, search and the theme's own static pages", async () => {
    const { data } = await getSitemap();

    expect(urls(data)).toContain(ORIGIN);
    expect(urls(data)).toContain(`${ORIGIN}/search`);
    routes.forEach((route) => expect(urls(data)).toContain(`${ORIGIN}/${route.path}`));
  });
});
