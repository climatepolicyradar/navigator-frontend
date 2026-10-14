import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { TLabelCategoryValue, TThemeConfig } from "@/types";

import { fetchSearchDocuments } from "./search";

const themeConfigWithCategories = (searchCategories: TLabelCategoryValue[]): TThemeConfig => ({
  ...DEFAULT_THEME_CONFIG,
  searchCategories,
});

const requestedFilters = (): string => {
  const url = vi.mocked(global.fetch).mock.calls[0][0] as URL;
  return url.searchParams.get("filters") ?? "";
};

describe("fetchSearchDocuments", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => ({}) } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not restrict categories when the theme has no search categories", async () => {
    await fetchSearchDocuments({ themeConfig: themeConfigWithCategories([]) });

    expect(requestedFilters()).not.toContain("category::");
  });

  it("restricts results to any of the theme's search categories", async () => {
    await fetchSearchDocuments({ themeConfig: themeConfigWithCategories(["Law", "Policy"]) });

    expect(JSON.parse(requestedFilters()).filters).toContainEqual({
      op: "or",
      filters: [
        { op: "contains", field: "labels.value.id", value: "category::Law" },
        { op: "contains", field: "labels.value.id", value: "category::Policy" },
      ],
    });
  });

  it("requires a minimum fraction of the query's terms to match", async () => {
    await fetchSearchDocuments({ themeConfig: themeConfigWithCategories([]), query: "adaptation strategy" });

    const url = vi.mocked(global.fetch).mock.calls[0][0] as URL;
    expect(url.searchParams.get("msm")).toBe("0.7");
  });

  it("does not send a minimum match when there is no query", async () => {
    await fetchSearchDocuments({ themeConfig: themeConfigWithCategories([]) });

    const url = vi.mocked(global.fetch).mock.calls[0][0] as URL;
    expect(url.searchParams.has("msm")).toBe(false);
  });
});
