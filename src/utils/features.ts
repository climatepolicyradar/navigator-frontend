import {
  AB_TEST_KEYS,
  CONFIG_FEATURE_KEYS,
  FEATURE_FLAG_KEYS,
  TConfigFeature,
  TConfigFeatureValue,
  TFeatureFlag,
  TFeatureFlags,
  TFeatures,
  TThemeConfig,
} from "@/types";

interface IArgs {
  configFeature?: TConfigFeatureValue;
  featureFlag?: boolean;
}

/**
 * Determines if a feature is on given its value and a feature flag value.
 * Settings turned ON in themes are always on, regardless of flag.
 * Settings turned off (false) in themes can be overridden by a flag.
 * Settings set to "never" are always off and not overridable.
 */
export const isFeatureEnabled = ({ configFeature, featureFlag }: IArgs): boolean => {
  switch (configFeature) {
    case true:
      return true;
    case "never":
      return false;
    case false:
      return featureFlag === true;
    default:
      return featureFlag ?? true;
  }
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
    const featuresToEnable = FEATURE_FLAG_KEYS.filter((key) => key !== "debug" && themeConfig.features[key as TConfigFeature] !== "never");
    featuresToEnable.forEach((feature) => (features[feature] = true));
  }

  return features;
};
