export const featureFlagKeys = ["concepts-v1", "corporate-reports", "litigation", "unfccc-filters"] as const;
export type TFeatureFlag = (typeof featureFlagKeys)[number];
export type TFeatureFlags = Record<TFeatureFlag, boolean>;
