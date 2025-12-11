export const featureFlagKeys = ["concepts-v1", "litigation"] as const;
type TFeatureFlag = (typeof featureFlagKeys)[number];
export type TFeatureFlags = Record<TFeatureFlag, boolean>;

export const configFeatureKeys = ["familyConceptsSearch", "knowledgeGraph", "litigation", "searchFamilySummary"] as const;
type TConfigFeature = (typeof configFeatureKeys)[number];
export type TConfigFeatures = Record<TConfigFeature, boolean>;
