/**
 * When adding or removing a new feature, make sure it is added to the appropriate array
 * Note that regardless of the array added to, feature names are unique
 * More info available in README.md
 */

/* Features */

// PostHog feature flags with 0% rollout. Must be manually enabled at /_feature-flags to be enabled
export const FEATURE_FLAG_KEYS = ["climate-cop31-2026", "debug", "geography-type-filters", "new-search", "subdivisions", "themes"] as const;

// PostHog feature flags with 1-100% rollout. Automatically rolled to each consenting user. Can also be present on /_feature-flags if configured in PostHog as an early access feature
export const AB_TEST_KEYS = ["ab-family-topic-block"] as const;

// Theme config feature configured at themes/THEME/config.ts features object
export const CONFIG_FEATURE_KEYS = [
  "climate-cop31-2026",
  "familyConceptsSearch",
  "geography-type-filters",
  "knowledgeGraph",
  "litigation",
  "new-search",
  "searchFamilySummary",
  "subdivisions",
  "themes",
] as const;

/* Types */

export type TFeatureFlag = (typeof FEATURE_FLAG_KEYS)[number];
export type TABTest = (typeof AB_TEST_KEYS)[number];
export type TFeatureFlags = Record<TFeatureFlag | TABTest, boolean>; // Treat all PostHog feature flags the same as they're sourced at the same time

export type TConfigFeature = (typeof CONFIG_FEATURE_KEYS)[number];
export type TConfigFeatures = Record<TConfigFeature, boolean>;

export type TFeature = TFeatureFlag | TABTest | TConfigFeature;
export type TFeatures = Record<TFeature, boolean>;
