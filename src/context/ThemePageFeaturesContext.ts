import { createContext } from "react";

import { DEFAULT_CONFIG_FEATURES, DEFAULT_FEATURE_FLAGS } from "@/constants/features";
import { TFeatureFlags, TThemeConfig } from "@/types";

type TThemePageFeatures = {
  featureFlags: TFeatureFlags;
  themeConfig: TThemeConfig;
};

export const ThemePageFeaturesContext = createContext<TThemePageFeatures>({
  featureFlags: DEFAULT_FEATURE_FLAGS,
  themeConfig: { features: DEFAULT_CONFIG_FEATURES } as TThemeConfig,
});
