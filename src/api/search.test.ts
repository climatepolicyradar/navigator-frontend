import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { TLabelCategoryValue, TThemeConfig } from "@/types";
import { inflateFilters } from "@/utils/filters/deflate";

import { fetchGeographiesAggregate, fetchSearchDocuments } from "./search";

const TEST_API_URL = "https://api.climatepolicyradar.org";

const themeConfigWithCategories = (searchCategories: TLabelCategoryValue[]): TThemeConfig => ({
  ...DEFAULT_THEME_CONFIG,
  searchCategories,
});

const requestedFilters = (): string => {
  const url = vi.mocked(global.fetch).mock.calls[0][0] as URL;
  expect(url.searchParams.get("encoding")).toBe("deflate");
  return inflateFilters(url.searchParams.get("filters") ?? "");
};

describe("fetchSearchDocuments", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not restrict categories when the theme has no search categories", async () => {
    await fetchSearchDocuments({
      apiUrl: TEST_API_URL,
      themeConfig: themeConfigWithCategories([]),
    });

    expect(requestedFilters()).not.toContain("category::");
  });

  it("restricts results to any of the theme's search categories", async () => {
    await fetchSearchDocuments({
      apiUrl: TEST_API_URL,
      themeConfig: themeConfigWithCategories(["Law", "Policy"]),
    });

    expect(JSON.parse(requestedFilters()).filters).toContainEqual({
      op: "or",
      filters: [
        { op: "contains", field: "labels.value.id", value: "category::Law" },
        { op: "contains", field: "labels.value.id", value: "category::Policy" },
      ],
    });
  });

  it("requires a minimum fraction of the query's terms to match", async () => {
    await fetchSearchDocuments({
      apiUrl: TEST_API_URL,
      themeConfig: themeConfigWithCategories([]),
      query: "adaptation strategy",
    });

    const url = vi.mocked(global.fetch).mock.calls[0][0] as URL;
    expect(url.searchParams.get("msm")).toBe("0.7");
  });

  it("does not send a minimum match when there is no query", async () => {
    await fetchSearchDocuments({
      apiUrl: TEST_API_URL,
      themeConfig: themeConfigWithCategories([]),
    });

    const url = vi.mocked(global.fetch).mock.calls[0][0] as URL;
    expect(url.searchParams.has("msm")).toBe(false);
  });

  it("excludes the theme's excluded labels from results", async () => {
    await fetchSearchDocuments({
      apiUrl: TEST_API_URL,
      themeConfig: {
        ...themeConfigWithCategories([]),
        searchExcludeLabels: ["author_type::Non-Party"],
      },
    });

    expect(JSON.parse(requestedFilters()).filters).toContainEqual({
      op: "not_contains",
      field: "labels.value.id",
      value: "author_type::Non-Party",
    });
  });
});

describe("fetchGeographiesAggregate", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] }),
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("requests the geographies aggregate endpoint", async () => {
    await fetchGeographiesAggregate({
      apiUrl: TEST_API_URL,
      themeConfig: themeConfigWithCategories([]),
    });

    const url = vi.mocked(global.fetch).mock.calls[0][0] as URL;
    expect(url.pathname).toBe("/search/geographies:aggregate");
  });

  it("scopes the counts with the same app filters a document search uses", async () => {
    await fetchGeographiesAggregate({
      apiUrl: TEST_API_URL,
      themeConfig: {
        ...themeConfigWithCategories(["Litigation"]),
        searchExcludeLabels: ["author_type::Non-Party"],
      },
    });

    const filters = JSON.parse(requestedFilters()).filters;
    expect(filters).toContainEqual({
      op: "or",
      filters: [
        {
          op: "contains",
          field: "labels.value.id",
          value: "category::Litigation",
        },
      ],
    });
    expect(filters).toContainEqual({
      op: "not_contains",
      field: "labels.value.id",
      value: "author_type::Non-Party",
    });
  });

  it("requests only the geography types asked for", async () => {
    await fetchGeographiesAggregate({
      apiUrl: TEST_API_URL,
      themeConfig: themeConfigWithCategories([]),
      geographyTypes: ["subdivision"],
    });

    const url = vi.mocked(global.fetch).mock.calls[0][0] as URL;
    expect(url.searchParams.getAll("labels.value.type")).toEqual(["subdivision"]);
  });

  it("maps the response to label id, name, type and count", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          {
            count: 5,
            value: {
              id: "subdivision::GB-NIR",
              value: "Northern Ireland",
              type: "subdivision",
            },
          },
        ],
      }),
    } as Response);

    const result = await fetchGeographiesAggregate({
      apiUrl: TEST_API_URL,
      themeConfig: themeConfigWithCategories([]),
    });

    expect(result).toEqual([
      {
        id: "subdivision::GB-NIR",
        name: "Northern Ireland",
        type: "subdivision",
        count: 5,
      },
    ]);
  });
});
