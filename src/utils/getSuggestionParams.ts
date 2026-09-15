import { TSearchSuggestion, TThemeConfig } from "@/types";

export const getSuggestionParams = (suggestion: TSearchSuggestion, themeConfig: TThemeConfig) =>
  themeConfig.features["new-search"] ? suggestion.newParams : suggestion.params;
