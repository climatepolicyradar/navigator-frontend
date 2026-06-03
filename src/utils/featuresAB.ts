import { useFeatureFlagEnabled } from "posthog-js/react";

import { AB_TEST_KEYS, TFeatures } from "@/types";

// Add A/B test feature flags into TFeatures. Does not work if called in getServerSideProps
export const getFeaturesWithABTests = (features: TFeatures): TFeatures => {
  const featuresWithABTests = { ...features };

  AB_TEST_KEYS.forEach((key) => {
    const abTestIsEnabled = useFeatureFlagEnabled(key);
    featuresWithABTests[key] = Boolean(abTestIsEnabled); // May be undefined if not yet initialised
  });

  return featuresWithABTests;
};
