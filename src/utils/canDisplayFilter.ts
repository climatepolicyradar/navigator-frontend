import { ParsedUrlQuery } from "querystring";

import { containsAny } from "./containsAny";

import { QUERY_PARAMS } from "@constants/queryParams";

import { TThemeConfig, TThemeConfigFilter } from "@types";

export const canDisplayFilter = (filter: TThemeConfigFilter, query: ParsedUrlQuery, themeConfig: TThemeConfig) => {
  if (!filter.category) return false;
  // No defied categories means it is for all
  if (filter.category.length === 0) return true;
  const selectedCategory = query[QUERY_PARAMS.category] as string;
  if (!selectedCategory) return false;
  const selectedCategoryValue = themeConfig.categories.options.find((c) => c.slug === selectedCategory);
  if (!selectedCategoryValue) return false;
  let canDisplay = false;
  if (containsAny(filter.category, selectedCategoryValue.value) || containsAny(filter.category, [selectedCategoryValue.alias])) return true;
  if (!filter.categoryKey) return false;
  const selectedCategoryKey = query[QUERY_PARAMS[filter.categoryKey]] as string;
  if (containsAny(filter.category, [selectedCategoryKey])) return true;
  return canDisplay;
};
