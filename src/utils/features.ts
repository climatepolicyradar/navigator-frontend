import { TFeatureFlags, TThemeConfig } from "@/types";

interface IArgs {
  configFeature?: boolean;
  featureFlag?: boolean;
}

// Determines if an app feature is on or off by combining app-level config and PostHog feature flags
export const isFeatureEnabled = ({ configFeature, featureFlag }: IArgs): boolean => {
  if (configFeature === undefined && featureFlag === undefined) return true; // No feature control = on
  if (configFeature === true) return true; // Config feature on = always on regardless of feature flags
  return featureFlag === true; // Config feature off + feature flag = use feature flag. This will be off is the feature flag is undefined
};

/* Specific feature shorthand functions */

export const isKnowledgeGraphEnabled = (featureFlags: TFeatureFlags, themeConfig: TThemeConfig) =>
  isFeatureEnabled({
    configFeature: themeConfig.features.knowledgeGraph,
    featureFlag: featureFlags["concepts-v1"],
  });

export const isLitigationEnabled = (featureFlags: TFeatureFlags, themeConfig: TThemeConfig) =>
  isFeatureEnabled({
    configFeature: themeConfig.features.litigation,
    featureFlag: featureFlags["litigation"],
  });

export const isFamilyConceptsEnabled = (featureFlags: TFeatureFlags, themeConfig: TThemeConfig) =>
  isFeatureEnabled({
    configFeature: themeConfig.features.familyConceptsSearch,
    featureFlag: featureFlags["family-concepts"],
  });

export const isUNFCCCFiltersEnabled = (featureFlags: TFeatureFlags) =>
  isFeatureEnabled({
    featureFlag: featureFlags["unfccc-filters"],
  });

export const isSearchFamilySummaryEnabled = (themeConfig: TThemeConfig) =>
  isFeatureEnabled({
    configFeature: themeConfig.features.searchFamilySummary,
  });

export const isNewPageDesignsEnabled = (featureFlags: TFeatureFlags, themeConfig: TThemeConfig) =>
  isFeatureEnabled({
    configFeature: themeConfig.features.newPageDesigns,
    featureFlag: featureFlags["new-page-designs"],
  });
