import { DEFAULT_FEATURE_FLAGS } from "@/constants/features";
import { TFeatureFlags } from "@/types";

/**
 * Creates feature flags with specific overrides
 * @param overrides - Partial feature flags to override defaults
 * @returns Feature flags with overrides applied
 */
export const createFeatureFlags = (overrides: Partial<TFeatureFlags> = {}): TFeatureFlags => ({
  ...DEFAULT_FEATURE_FLAGS,
  ...overrides,
});

/**
 * Mock feature flags with concepts-v1 enabled
 */
export const mockFeatureFlagsWithConcepts = createFeatureFlags({
  "concepts-v1": true,
});

/**
 * Mock feature flags with concepts-v1 disabled
 */
export const mockFeatureFlagsWithoutConcepts = createFeatureFlags({
  "concepts-v1": false,
});
