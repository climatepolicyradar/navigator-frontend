import { useContext } from "react";

import { ThemeContext } from "@/context/ThemeContext";
import { CONFIG_FEATURE_KEYS, FEATURE_FLAG_KEYS, TConfigFeature, TFeatureFlag, TFeatureFlags, TFeatures } from "@/types";
import { isFeatureEnabled } from "@/utils/features";

export const useFeatures = (featureFlags: TFeatureFlags) => {
  const { loaded, themeConfig } = useContext(ThemeContext);

  // Only keys defined in these two array will be included
  const featureKeys: (TFeatureFlag | TConfigFeature)[] = Array.from(new Set([...FEATURE_FLAG_KEYS, ...CONFIG_FEATURE_KEYS]));

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

  return {
    features,
    themeLoaded: loaded,
  };
};
