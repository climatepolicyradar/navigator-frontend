import { createContext } from "react";

import { DEFAULT_FEATURE_FLAGS } from "@/constants/features";
import { TFeatureFlags } from "@/types";

export const FeatureFlagsContext = createContext<TFeatureFlags>(DEFAULT_FEATURE_FLAGS);
