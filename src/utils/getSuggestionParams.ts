import { TSearchSuggestion, TThemeConfig } from "@/types";

export const getSuggestionParams = (suggestion: TSearchSuggestion, themeConfig: TThemeConfig) =>
  themeConfig.features["new-search"] === true ? suggestion.newParams : suggestion.params;
