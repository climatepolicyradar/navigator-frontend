import { FEATURE_KEYS, TFeatures, TThemeConfig } from "@/types";

interface IArgs {
  configFeature?: boolean;
  featureFlag?: boolean;
}

// Determines if an app feature is on or off by combining app-level config and PostHog feature flags
export const isFeatureEnabled = ({ configFeature, featureFlag }: IArgs): boolean => {
  if (configFeature === undefined && featureFlag === undefined) return false; // No feature control = off
  if (configFeature === true) return true; // Config feature on = always on regardless of feature flags
  return featureFlag === true; // Config feature off + feature flag = use feature flag. This will be off is the feature flag is undefined
};

// Constructs an object containing all feature flags & config features and whether they're enabled or not
// Prefer FeaturesContext over getFeatures where possible. Use getFeatures in getServerSideProps or inside page components
export const getFeatures = (themeConfig: TThemeConfig, featureFlags: TFeatures): TFeatures => {
  // Construct an object of feature keys and boolean values. This simplifies the relation between feature flags and config features
  const features = Object.fromEntries(
    FEATURE_KEYS.map((featureKey) => {
      const isEnabled = isFeatureEnabled({
        configFeature: themeConfig.features[featureKey],
        featureFlag: featureFlags[featureKey],
      });

      return [featureKey, isEnabled];
    })
  ) as TFeatures;

  // Turn on all feature flags when instructed to by E2E CI for testing
  if (process.env.E2E_TEST_FEATURE_FLAGS === "true") {
    FEATURE_KEYS.forEach((feature) => {
      if (feature !== "debug") features[feature] = true;
    });
  }

  return features;
};
