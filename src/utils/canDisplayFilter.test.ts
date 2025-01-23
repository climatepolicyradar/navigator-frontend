import { canDisplayFilter } from "./canDisplayFilter";

import { QUERY_PARAMS } from "@constants/queryParams";

import { TThemeConfig } from "@types";

const testThemeConfig: TThemeConfig = {
  categories: {
    label: "TEST CATEGORIES",
    options: [
      {
        label: "TEST CATEGORY 1",
        slug: "test_category_1",
        value: ["test_category_1"],
      },
      {
        label: "TEST CATEGORY 2",
        slug: "test_category_2",
        value: ["test_category_2"],
      },
      {
        label: "TEST CATEGORY 3",
        slug: "test_category_3",
        value: ["test_category_3"],
        alias: "test_category_3_alias",
      },
    ],
  },
  filters: [
    {
      label: "Status",
      taxonomyKey: "status",
      apiMetaDataKey: "family.status",
      type: "radio",
      category: ["corpus1", "corpus2", "corpus3", "corpus4"],
      dependentFilterKey: "fund",
    },
  ],
  labelVariations: [],
  links: [],
  documentCategories: [],
  metadata: [],
};

describe("canDisplayFilter: ", () => {
  it("should return true if the filter does not have a dependant category", () => {
    const filter = { label: "TEST FILTER", category: [], taxonomyKey: "test_filter", type: "radio" };

    const canDisplay = canDisplayFilter(filter, {}, testThemeConfig);

    expect(canDisplay).toBe(true);
  });

  it("should return false if we don't have a category selected"),
    () => {
      const filter = { label: "TEST FILTER", category: ["test_category_1"], taxonomyKey: "test_filter", type: "radio" };

      const canDisplay = canDisplayFilter(filter, {}, testThemeConfig);

      expect(canDisplay).toBe(false);
    };

  it("should return false if the selected category is not in the theme's categories", () => {
    const filter = { label: "TEST FILTER", category: ["test_category_999"], taxonomyKey: "test_filter", type: "radio" };

    const canDisplay = canDisplayFilter(filter, { [QUERY_PARAMS.category]: "test_category_2" }, testThemeConfig);

    expect(canDisplay).toBe(false);
  });
});
