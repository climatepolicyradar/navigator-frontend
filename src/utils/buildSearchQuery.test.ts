import { DEFAULT_CONFIG_FEATURES } from "@/constants/features";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { TThemeConfig } from "@/types";

import buildSearchQuery from "./buildSearchQuery";

describe("buildSearchQuery: ", () => {
  it("should use All.categories if there's no category in the routerQuery", () => {
    const allCategories = ["CCLW.corpus.i00000001.n0000", "CPR.corpus.i00000592.n0000", "MCF.corpus.AF.Guidance"];
    const unfcccCategories = ["UNFCCC.corpus.i00000001.n0000"];
    const themeConfig: TThemeConfig = {
      ...DEFAULT_THEME_CONFIG,
      defaultCorpora: undefined,
      categories: {
        label: "Category",
        options: [
          {
            label: "All",
            slug: "All",
            value: allCategories,
          },
          {
            label: "UNFCCC",
            slug: "UNFCCC",
            value: unfcccCategories,
          },
        ],
      },
      features: {
        ...DEFAULT_CONFIG_FEATURES,
        knowledgeGraph: true,
        searchFamilySummary: true,
      },
    };

    const searchQueryWithNoCategory = buildSearchQuery({}, themeConfig);
    expect(searchQueryWithNoCategory.corpus_import_ids).toBe(allCategories);

    const searchQueryWithCategory = buildSearchQuery({ c: "UNFCCC" }, themeConfig);
    expect(searchQueryWithCategory.corpus_import_ids).toBe(unfcccCategories);
  });

  it("should set the sort order to 'date' 'descending' if no query or sort is provided", () => {
    const themeConfig: TThemeConfig = {
      ...DEFAULT_THEME_CONFIG,
      defaultCorpora: undefined,
      categories: {
        label: "Category",
        options: [],
      },
      features: {
        ...DEFAULT_CONFIG_FEATURES,
        knowledgeGraph: true,
        searchFamilySummary: true,
      },
    };

    const searchQuery = buildSearchQuery({}, themeConfig);
    expect(searchQuery.sort_field).toEqual("date");
    expect(searchQuery.sort_order).toEqual("desc");
  });
});
