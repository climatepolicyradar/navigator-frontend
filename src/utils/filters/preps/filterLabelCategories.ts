import { TLabelCategoryValue, TNestedSearchLabel, TThemeConfig } from "@/types";

export const filterLabelCategories = (rootLabels: TNestedSearchLabel[], themeConfig: TThemeConfig) =>
  rootLabels.filter((label) => themeConfig.searchCategories.includes(label.value as TLabelCategoryValue));
