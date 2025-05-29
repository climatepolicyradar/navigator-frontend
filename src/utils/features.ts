import { TFeatureFlags, TThemeConfig } from "@/types";

interface IArgs {
  configFeature?: boolean;
  featureFlag?: boolean;
}

// Determines if an app feature is on or off by combining app-level config and PostHog feature flags
export const isFeatureEnabled = ({ configFeature, featureFlag }: IArgs): boolean => {
  if (configFeature === undefined && featureFlag === undefined) return false; // Shouldn't be using this fn
  if (configFeature === false) return false; // Config feature off = always off
  if (configFeature === true && featureFlag === undefined) return true; // Config feature on = on
  return featureFlag === true; // Config feature on + feature flag = use feature flag
};

/* Specific feature shorthand functions */

export const isCorporateReportsEnabled = (featureFlags: TFeatureFlags) =>
  isFeatureEnabled({
    featureFlag: featureFlags["corporate-reports"],
  });

export const isKnowledgeGraphEnabled = (featureFlags: TFeatureFlags, themeConfig: TThemeConfig) =>
  isFeatureEnabled({
    configFeature: themeConfig.features.knowledgeGraph,
    featureFlag: featureFlags["concepts-v1"],
  });

export const isLitigationEnabled = (featureFlags: TFeatureFlags) =>
  isFeatureEnabled({
    featureFlag: featureFlags["litigation"],
  });

export const isUNFCCCFiltersEnabled = (featureFlags: TFeatureFlags) =>
  isFeatureEnabled({
    featureFlag: featureFlags["unfccc-filters"],
  });
