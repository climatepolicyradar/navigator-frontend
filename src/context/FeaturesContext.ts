import { createContext } from "react";

import { DEFAULT_FEATURES } from "@/constants/features";
import { TFeatures } from "@/types";

// Computed feature on/off from feature flags + config features
export const FeaturesContext = createContext<TFeatures>(DEFAULT_FEATURES);
