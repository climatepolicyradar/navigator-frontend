// All available feature flags. If adding a new one, make sure to add it here or it won't be available via useFeatures
export const featureFlagKeys = ["concepts-v1", "litigation"] as const;
export type TFeatureFlag = (typeof featureFlagKeys)[number];
export type TFeatureFlags = Record<TFeatureFlag, boolean>;

// All available theme config features. Each must be explicitly defined in each config's features object
export const configFeatureKeys = ["familyConceptsSearch", "knowledgeGraph", "litigation", "searchFamilySummary"] as const;
export type TConfigFeature = (typeof configFeatureKeys)[number];
export type TConfigFeatures = Record<TConfigFeature, boolean>;

export type TFeatures = Record<TFeatureFlag | TConfigFeature, boolean>;
