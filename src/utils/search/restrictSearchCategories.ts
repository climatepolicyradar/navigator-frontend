import { ID_SEPARATOR } from "@/constants/chars";
import { TSearchQueryGroup, TThemeConfig } from "@/types";

export const restrictSearchCategories = (searchQueryGroup: TSearchQueryGroup, themeConfig: TThemeConfig): TSearchQueryGroup => {
  const categoryValues = themeConfig.searchCategories;
  if (categoryValues.length === 0) return searchQueryGroup;

  return {
    op: "and",
    filters: [
      searchQueryGroup,
      {
        op: "or",
        filters: categoryValues.map((categoryValue) => ({
          op: "contains",
          field: "labels.value.id",
          value: ["category", categoryValue].join(ID_SEPARATOR),
        })),
      },
    ],
  };
};
