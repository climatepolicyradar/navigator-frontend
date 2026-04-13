import { AB_TEST_KEYS, CONFIG_FEATURE_KEYS, FEATURE_FLAG_KEYS, TConfigFeatures, TFeatureFlags, TFeatures } from "@/types";

export const DEFAULT_FEATURE_FLAGS = Object.fromEntries([...FEATURE_FLAG_KEYS, ...AB_TEST_KEYS].map((key) => [key, false])) as TFeatureFlags;
export const DEFAULT_CONFIG_FEATURES = Object.fromEntries(CONFIG_FEATURE_KEYS.map((key) => [key, false])) as TConfigFeatures;
export const DEFAULT_FEATURES: TFeatures = { ...DEFAULT_FEATURE_FLAGS, ...DEFAULT_CONFIG_FEATURES };
