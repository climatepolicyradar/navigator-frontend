import { abTestKeys, configFeatureKeys, featureFlagKeys, TConfigFeatures, TFeatureFlags, TFeatures } from "@/types";

export const DEFAULT_FEATURE_FLAGS = Object.fromEntries([...featureFlagKeys, ...abTestKeys].map((key) => [key, false])) as TFeatureFlags;
export const DEFAULT_CONFIG_FEATURES = Object.fromEntries(configFeatureKeys.map((key) => [key, false])) as TConfigFeatures;
export const DEFAULT_FEATURES: TFeatures = { ...DEFAULT_FEATURE_FLAGS, ...DEFAULT_CONFIG_FEATURES };
