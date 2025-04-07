import buildSearchQuery from "./buildSearchQuery";

describe("buildSearchQuery: ", () => {
  it("should use All.categories if there's no category in the routerQuery", () => {
    const allCategories = ["CCLW.corpus.i00000001.n0000", "CPR.corpus.i00000592.n0000", "MCF.corpus.AF.Guidance"];
    const unfcccCategories = ["UNFCCC.corpus.i00000001.n0000"];
    const themeConfig = {
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
      filters: [],
      labelVariations: [],
      links: [],
      metadata: [],
      documentCategories: [],
    };

    const searchQueryWithNoCategory = buildSearchQuery({}, themeConfig);
    expect(searchQueryWithNoCategory.corpus_import_ids).toBe(allCategories);

    const searchQueryWithCategory = buildSearchQuery({ c: "UNFCCC" }, themeConfig);
    expect(searchQueryWithCategory.corpus_import_ids).toBe(unfcccCategories);
  });
});
