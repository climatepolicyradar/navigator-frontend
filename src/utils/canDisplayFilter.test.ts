import { DEFAULT_CONFIG_FEATURES } from "@/constants/features";
import { QUERY_PARAMS } from "@/constants/queryParams";
import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { TThemeConfig, TThemeConfigFilter } from "@/types";

import { canDisplayFilter } from "./canDisplayFilter";

const testThemeConfig: TThemeConfig = {
  ...DEFAULT_THEME_CONFIG,
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
      label: "TEST FILTER",
      taxonomyKey: "fund_doc_type",
      apiMetaDataKey: "test.filter",
      type: "radio",
      category: ["corpus1", "corpus2", "corpus3", "corpus4"],
      options: [
        {
          label: "TEST OPTION 1",
          slug: "test_option_1",
          value: [],
        },
        {
          label: "TEST OPTION 2",
          slug: "test_option_2",
          value: [],
        },
      ],
    },
  ],
  features: {
    ...DEFAULT_CONFIG_FEATURES,
    searchFamilySummary: true,
  },
};

describe("canDisplayFilter: ", () => {
  it("should return true if the filter does not have a dependant category", () => {
    const filter: TThemeConfigFilter = {
      label: "TEST FILTER",
      category: [],
      taxonomyKey: "page_size",
      type: "radio",
    };

    const canDisplay = canDisplayFilter(filter, {}, testThemeConfig);

    expect(canDisplay).toBe(true);
  });

  it("should return false if we don't have a category selected", () => {
    const filter: TThemeConfigFilter = {
      label: "TEST FILTER",
      category: ["test_category_1"],
      taxonomyKey: "page_size",
      type: "radio",
    };

    const canDisplay = canDisplayFilter(filter, {}, testThemeConfig);

    expect(canDisplay).toBe(false);
  });

  it("should return false if the selected category is not in the theme's categories", () => {
    const filter: TThemeConfigFilter = {
      label: "TEST FILTER",
      category: ["test_category_999"],
      taxonomyKey: "page_size",
      type: "radio",
    };

    const canDisplay = canDisplayFilter(filter, { [QUERY_PARAMS.category]: "test_category_2" }, testThemeConfig);

    expect(canDisplay).toBe(false);
  });

  it("should return true if the selected category is in the filter's category", () => {
    const filter: TThemeConfigFilter = {
      label: "TEST FILTER",
      category: ["test_category_2"],
      taxonomyKey: "page_size",
      type: "radio",
    };

    const canDisplay = canDisplayFilter(filter, { [QUERY_PARAMS.category]: "test_category_2" }, testThemeConfig);

    expect(canDisplay).toBe(true);
  });

  it("should return true if the selected category is in the filter's category alias", () => {
    const filter: TThemeConfigFilter = {
      label: "TEST FILTER",
      category: ["test_category_3_alias"],
      taxonomyKey: "page_size",
      type: "radio",
    };

    const canDisplay = canDisplayFilter(filter, { [QUERY_PARAMS.category]: "test_category_3" }, testThemeConfig);

    expect(canDisplay).toBe(true);
  });

  it("should return true if the selected category is in the filter's category and the category key is set", () => {
    const filter: TThemeConfigFilter = {
      label: "TEST DEPENDANT FILTER",
      taxonomyKey: "offset",
      type: "radio",
      category: ["test_option_2"],
      categoryKey: "fund_doc_type",
    };

    const canDisplay = canDisplayFilter(filter, { [QUERY_PARAMS[filter.categoryKey]]: "test_option_2" }, testThemeConfig);

    expect(canDisplay).toBe(true);
  });

  it("should return true if the category is in a different case", () => {
    const filter: TThemeConfigFilter = {
      label: "TEST FILTER",
      category: ["test_category_3"],
      taxonomyKey: "page_size",
      corporaKey: "TEST_CATEGORY_3",
      type: "radio",
    };

    const canDisplay = canDisplayFilter(filter, { [QUERY_PARAMS.category]: "test_CATEGORY_3" }, testThemeConfig);

    expect(canDisplay).toBe(true);
  });
});
