/**
 * When adding or removing a new feature, make sure it is added to the appropriate array
 * Note that regardless of the array added to, feature names are unique
 * More info available in README.md
 */

/* Features */

// PostHog feature flags with 0% rollout. Must be manually enabled at /_feature-flags to be enabled
export const featureFlagKeys = ["concepts-v1", "litigation"] as const;

// PostHog feature flags with 1-100% rollout. Automatically rolled to each consenting user. Can also be present on /_feature-flags if configured in PostHog as an early access feature
export const abTestKeys = ["ab-example"] as const;

// Theme config feature configured at themes/THEME/config.ts features object
export const configFeatureKeys = ["familyConceptsSearch", "knowledgeGraph", "litigation", "searchFamilySummary"] as const;

/* Types */

export type TFeatureFlag = (typeof featureFlagKeys)[number];
export type TABTest = (typeof abTestKeys)[number];
export type TFeatureFlags = Record<TFeatureFlag | TABTest, boolean>; // Treat all PostHog feature flags the same as they're sourced at the same time

export type TConfigFeature = (typeof configFeatureKeys)[number];
export type TConfigFeatures = Record<TConfigFeature, boolean>;

export type TFeature = TFeatureFlag | TABTest | TConfigFeature;
export type TFeatures = Record<TFeature, boolean>;
