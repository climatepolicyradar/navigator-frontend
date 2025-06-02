export const featureFlagKeys = ["concepts-v1", "corporate-reports", "litigation", "unfccc-filters"] as const;
export type TFeatureFlag = (typeof featureFlagKeys)[number];
export type TFeatureFlags = Record<TFeatureFlag, boolean>;

export const configFeatureKeys = ["knowledgeGraph"] as const;
export type TConfigFeature = (typeof configFeatureKeys)[number];
export type TConfigFeatures = Record<TConfigFeature, boolean>;
