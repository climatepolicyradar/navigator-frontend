import { createContext } from "react";

import { DEFAULT_FEATURES } from "@/constants/features";
import { TFeatures } from "@/types";

export const FeaturesContext = createContext<TFeatures>(DEFAULT_FEATURES);
