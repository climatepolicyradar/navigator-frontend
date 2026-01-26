import { createContext } from "react";

import { DEFAULT_FEATURE_FLAGS } from "@/constants/features";
import { TFeatureFlags } from "@/types";

// Only to be used on app-specific pages where FeaturesContext is not available
export const FeatureFlagsContext = createContext<TFeatureFlags>(DEFAULT_FEATURE_FLAGS);
