import { ParsedUrlQuery } from "querystring";

import { QUERY_PARAMS, type TQueryParams } from "@/constants/queryParams";
import { TThemeConfig, TThemeConfigFilter } from "@/types";

import { containsAny } from "./containsAny";

export const canDisplayFilter = (filter: TThemeConfigFilter, query: ParsedUrlQuery, themeConfig: TThemeConfig) => {
  const canDisplay = false;
  if (!filter.category) return false;
  // Check whether the filter has a category it is associated with
  // No defined categories on the filter means it is for all
  if (filter.category.length === 0) return true;
  // Check whether we have a selected category
  if (filter.categoryKey) {
    // Check whether the filter has a dependent category key (such as another filter)
    const selectedCategoryKey = query[QUERY_PARAMS[filter.categoryKey as TQueryParams]] as string;
    if (containsAny(filter.category, [selectedCategoryKey])) return true;
  }
  const selectedCategory = query[QUERY_PARAMS.category] as string;
  if (!selectedCategory) return false;
  // Check whether the selected category is in theme's categories (someone might manipulate the query)
  const selectedCategoryValue = themeConfig.categories.options.find((c) => c.slug.toLowerCase() === selectedCategory.toLowerCase());
  if (!selectedCategoryValue) return false;
  // Check whether the selected category is in the filter's category, and check the alias field too
  if (containsAny(filter.category, selectedCategoryValue.value) || containsAny(filter.category, [selectedCategoryValue.alias])) return true;
  if (!filter.categoryKey) return false;
  return canDisplay;
};
