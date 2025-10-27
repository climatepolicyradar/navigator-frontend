export const featureFlagKeys = ["concepts-v1", "litigation", "new-page-designs", "rio-policy-radar"] as const;
export type TFeatureFlag = (typeof featureFlagKeys)[number];
export type TFeatureFlags = Record<TFeatureFlag, boolean>;

export const configFeatureKeys = ["familyConceptsSearch", "knowledgeGraph", "litigation", "newPageDesigns", "searchFamilySummary"] as const;
export type TConfigFeature = (typeof configFeatureKeys)[number];
export type TConfigFeatures = Record<TConfigFeature, boolean>;
