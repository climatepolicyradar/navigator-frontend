import { configFeatureKeys, featureFlagKeys, TConfigFeature, TFeatureFlag, TFeatureFlags, TFeatures, TTheme, TThemeConfig } from "@/types";

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
export const getFeatures = (themeConfig: TThemeConfig, featureFlags: TFeatureFlags) => {
  // Only keys defined in these two array will be included
  const featureKeys: (TFeatureFlag | TConfigFeature)[] = Array.from(new Set([...featureFlagKeys, ...configFeatureKeys]));

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
