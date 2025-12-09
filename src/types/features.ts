export const featureFlagKeys = ["concepts-v1", "litigation", "rio-policy-radar"] as const;
type TFeatureFlag = (typeof featureFlagKeys)[number];
export type TFeatureFlags = Record<TFeatureFlag, boolean>;

export const configFeatureKeys = ["familyConceptsSearch", "knowledgeGraph", "litigation", "searchFamilySummary", "rioPolicyRadar"] as const;
type TConfigFeature = (typeof configFeatureKeys)[number];
export type TConfigFeatures = Record<TConfigFeature, boolean>;
