import { useContext } from "react";

import { ThemeContext } from "@/context/ThemeContext";
import { FEATURE_KEYS, TFeatures } from "@/types";
import { isFeatureEnabled } from "@/utils/features";

export const useFeatures = (featureFlags: TFeatures) => {
  const { themeConfig } = useContext(ThemeContext);

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

  return {
    features,
  };
};
