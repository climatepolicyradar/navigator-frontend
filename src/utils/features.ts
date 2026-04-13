import { useFeatureFlagEnabled } from "posthog-js/react";

import { AB_TEST_KEYS, CONFIG_FEATURE_KEYS, FEATURE_FLAG_KEYS, TConfigFeature, TFeatureFlag, TFeatureFlags, TFeatures, TThemeConfig } from "@/types";

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
export const getFeatures = (themeConfig: TThemeConfig, featureFlags: TFeatureFlags): TFeatures => {
  // Only keys defined in these two array will be included
  const featureKeys: (keyof TFeatures)[] = Array.from(new Set([...FEATURE_FLAG_KEYS, ...AB_TEST_KEYS, ...CONFIG_FEATURE_KEYS]));

  // Construct an object of feature keys and boolean values. This simplifies the relation between feature flags and config features
  const features = Object.fromEntries(
    featureKeys.map((featureKey) => {
      const isEnabled = isFeatureEnabled({
        configFeature: themeConfig.features[featureKey as TConfigFeature],
        featureFlag: featureFlags[featureKey as TFeatureFlag],
      });

      return [featureKey, isEnabled];
    })
  ) as TFeatures;

  // Turn on all feature flags when instructed to by E2E CI for testing
  if (process.env.E2E_TEST_FEATURE_FLAGS === "true") {
    const featuresToEnable = FEATURE_FLAG_KEYS.filter((key) => key !== "debug");
    featuresToEnable.forEach((feature) => (features[feature] = true));
  }

  return features;
};

// Add A/B test feature flags into TFeatures. Does not work if called in getServerSideProps
export const getFeaturesWithABTests = (features: TFeatures): TFeatures => {
  const featuresWithABTests = { ...features };

  AB_TEST_KEYS.forEach((key) => {
    const abTestIsEnabled = useFeatureFlagEnabled(key);
    featuresWithABTests[key] = Boolean(abTestIsEnabled); // May be undefined if not yet initialised
  });

  return featuresWithABTests;
};
