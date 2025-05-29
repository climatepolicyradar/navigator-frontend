import { configFeatureKeys, featureFlagKeys, TConfigFeatures, TFeatureFlags } from "@/types";

export const DEFAULT_FEATURE_FLAGS = Object.fromEntries(featureFlagKeys.map((key) => [key, false])) as TFeatureFlags;

export const DEFAULT_CONFIG_FEATURES = Object.fromEntries(configFeatureKeys.map((key) => [key, false])) as TConfigFeatures;
