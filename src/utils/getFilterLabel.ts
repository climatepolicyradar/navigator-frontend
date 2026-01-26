import { TLabelVariationKey, TThemeConfig } from "@/types";

import { containsAny } from "./containsAny";

export const getFilterLabel = (fallbackLabel: string, key: TLabelVariationKey, queryCategories: string | string[], themeConfig: TThemeConfig) => {
  if (!themeConfig) return fallbackLabel;

  const labelVariation = themeConfig.labelVariations[key];
  if (!labelVariation) return fallbackLabel;

  // If our label variation does not have any categories - we assume that is for all
  if (labelVariation && labelVariation.category.length === 0) {
    return labelVariation.label;
  }

  // Otherwise - we check if the category values are in our label variation defined categories
  if (!Array.isArray(queryCategories)) {
    const categoryValues = themeConfig.categories.options.find((category) => category.slug === queryCategories);
    if (categoryValues && labelVariation && containsAny(labelVariation.category, categoryValues.value)) {
      return labelVariation.label;
    }
  }

  return fallbackLabel;
};
