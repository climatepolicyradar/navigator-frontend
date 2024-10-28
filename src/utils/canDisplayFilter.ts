import { ParsedUrlQuery } from "querystring";

import { containsAny } from "./containsAny";

import { QUERY_PARAMS } from "@constants/queryParams";

import { TThemeConfig, TThemeConfigFilter } from "@types";

export const canDisplayFilter = (filter: TThemeConfigFilter, query: ParsedUrlQuery, themeConfig: TThemeConfig) => {
  if (!filter.category) return false;
  const selectedCategory = query[QUERY_PARAMS.category] as string;
  if (!selectedCategory) return false;
  const selectedCategoryValue = themeConfig.categories.options.find((c) => c.slug === selectedCategory);
  if (!selectedCategoryValue) return false;
  let canDisplay = false;
  if (containsAny(filter.category, selectedCategoryValue.value)) return true;
  return canDisplay;
};
