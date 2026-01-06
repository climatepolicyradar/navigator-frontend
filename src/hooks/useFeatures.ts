import { useContext } from "react";

import { ThemeContext } from "@/context/ThemeContext";
import { configFeatureKeys, featureFlagKeys, TConfigFeature, TFeatureFlag, TFeatureFlags, TFeatures } from "@/types";
import { isFeatureEnabled } from "@/utils/features";

export const useFeatures = (featureFlags: TFeatureFlags) => {
  const { loaded, themeConfig } = useContext(ThemeContext);

  // Only keys defined in these two array will be included
  const featureKeys: (TFeatureFlag | TConfigFeature)[] = Array.from(new Set([...featureFlagKeys, ...configFeatureKeys]));

  // Construct an object of feature keys and boolean values. This simplifies the relation between feature flags and config features
  const features = Object.fromEntries(
    featureKeys.map((featureKey) => {
      const isEnabled = isFeatureEnabled({
        configFeature: themeConfig.features[featureKey],
        featureFlag: featureFlags[featureKey],
      });

      return [featureKey, isEnabled];
    })
  ) as TFeatures;

  return {
    features,
    themeLoaded: loaded,
  };
};
