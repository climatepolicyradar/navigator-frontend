import { useFeatureFlagEnabled } from "posthog-js/react";

import { abTestKeys, configFeatureKeys, featureFlagKeys, TFeatureFlags, TFeatures, TThemeConfig } from "@/types";

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

// Constructs an object containing all feature flags & config features and whether they're enabled or not
// Prefer FeaturesContext over getFeatures where possible. Use getFeatures in getServerSideProps or inside page components
export const getFeatures = (themeConfig: TThemeConfig, featureFlags: TFeatureFlags) => {
  // Only keys defined in these two array will be included
  const featureKeys: (keyof TFeatures)[] = Array.from(new Set([...featureFlagKeys, ...abTestKeys, ...configFeatureKeys]));

  // Construct an object of feature keys and boolean values. This simplifies the relation between feature flags and config features
  return Object.fromEntries(
    featureKeys.map((featureKey) => {
      const isEnabled = isFeatureEnabled({
        configFeature: themeConfig.features[featureKey],
        featureFlag: featureFlags[featureKey],
      });

      return [featureKey, isEnabled];
    })
  ) as TFeatures;
};

// Add A/B test feature flags into TFeatures. Does not work if called in getServerSideProps
export const getFeaturesWithABTests = (features: TFeatures): TFeatures => {
  const featuresWithABTests = { ...features };

  abTestKeys.forEach((key) => {
    const abTestIsEnabled = useFeatureFlagEnabled(key);
    featuresWithABTests[key] = Boolean(abTestIsEnabled); // May be undefined if not yet initialised
  });

  return featuresWithABTests;
};
