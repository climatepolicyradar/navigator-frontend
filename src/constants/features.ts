import { FEATURE_KEYS, TFeatures } from "@/types";

export const DEFAULT_FEATURES = Object.fromEntries(FEATURE_KEYS.map((key) => [key, false])) as TFeatures;
