import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { TLabelCategoryValue, TSearchQueryGroup, TThemeConfig } from "@/types";

import { restrictSearchCategories } from "./restrictSearchCategories";

const themeConfigWithCategories = (searchCategories: TLabelCategoryValue[]): TThemeConfig => ({
  ...DEFAULT_THEME_CONFIG,
  searchCategories,
});

const searchQueryGroup: TSearchQueryGroup = {
  op: "and",
  filters: [{ field: "labels.value.id", op: "contains", value: "country::LVA", checked: true }],
};

describe("restrictSearchCategories", () => {
  it("returns the query group unchanged when the theme has no search categories", () => {
    expect(restrictSearchCategories(searchQueryGroup, themeConfigWithCategories([]))).toBe(searchQueryGroup);
  });

  it("wraps the query group with a single category restriction", () => {
    expect(restrictSearchCategories(searchQueryGroup, themeConfigWithCategories(["Litigation"]))).toEqual({
      op: "and",
      filters: [
        searchQueryGroup,
        {
          op: "or",
          filters: [{ op: "contains", field: "labels.value.id", value: "category::Litigation" }],
        },
      ],
    });
  });

  it("wraps the group with multiple category restrictions", () => {
    expect(restrictSearchCategories(searchQueryGroup, themeConfigWithCategories(["Law", "Policy", "UN submission"]))).toEqual({
      op: "and",
      filters: [
        searchQueryGroup,
        {
          op: "or",
          filters: [
            { op: "contains", field: "labels.value.id", value: "category::Law" },
            { op: "contains", field: "labels.value.id", value: "category::Policy" },
            { op: "contains", field: "labels.value.id", value: "category::UN submission" },
          ],
        },
      ],
    });
  });

  it("wraps an empty query group", () => {
    const emptyGroup: TSearchQueryGroup = { op: "and", filters: [] };

    expect(restrictSearchCategories(emptyGroup, themeConfigWithCategories(["Report"]))).toEqual({
      op: "and",
      filters: [
        emptyGroup,
        {
          op: "or",
          filters: [{ op: "contains", field: "labels.value.id", value: "category::Report" }],
        },
      ],
    });
  });

  it("does not mutate the original query group", () => {
    const original = structuredClone(searchQueryGroup);

    restrictSearchCategories(searchQueryGroup, themeConfigWithCategories(["Law"]));

    expect(searchQueryGroup).toEqual(original);
  });
});
