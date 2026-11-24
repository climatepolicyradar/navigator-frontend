import { createContext } from "react";

import { DEFAULT_FEATURES } from "@/constants/features";
import { TFeatures } from "@/types";

// Only to be used on app-specific pages where FeaturesContext is not available
export const FeatureFlagsContext = createContext<TFeatures>(DEFAULT_FEATURES);
