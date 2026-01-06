// Note: feature flags and config features with the same key are considered the same feature

// All available feature flags. If adding a new one, make sure to add it here or it won't be available via useFeatures
export const featureFlagKeys = ["concepts-v1", "litigation"] as const;
export type TFeatureFlag = (typeof featureFlagKeys)[number];
export type TFeatureFlags = Record<TFeatureFlag, boolean>;

// All available theme config features. Each must be explicitly defined in each config's features object
export const configFeatureKeys = ["familyConceptsSearch", "knowledgeGraph", "litigation", "searchFamilySummary"] as const;
export type TConfigFeature = (typeof configFeatureKeys)[number];
export type TConfigFeatures = Record<TConfigFeature, boolean>;

export type TFeature = TFeatureFlag | TConfigFeature;
export type TFeatures = Record<TFeature, boolean>;
