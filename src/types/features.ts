/**
 * Features are an amalgam of two intentionally matching strings:
 * 1. App-specific config feature key for features that are long-term different per app
 * 2. PostHog feature flags + early access features that can be toggled per-user at /_feature-flags
 * When adding/removing a feature, make sure both of the above are set up / torn down fully
 */

export const FEATURE_KEYS = ["debug", "geography-type-filters", "litigation", "subdivisions", "themes"] as const;

export type TFeatureFlag = (typeof FEATURE_KEYS)[number];
export type TFeatures = Record<TFeatureFlag, boolean>;
