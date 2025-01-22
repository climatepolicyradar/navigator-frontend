import Button from "@components/buttons/Button";
import { deleteFeatureFlagCookie, enableFeatureFlagCookie } from "@utils/featureFlags";
import { usePostHog } from "posthog-js/react";

export default function FeatureFlags() {
  const posthog = usePostHog();

  /**
   * This key is a public key.
   * @see: https://posthog.com/docs/privacy#is-it-ok-for-my-api-key-to-be-exposed-and-public
   */
  posthog.init("phc_zaZYaLxsAeMjCLPsU2YvFqu4oaXRJ8uAkgXY8DancyL", {
    api_host: "https://eu.i.posthog.com",
    opt_in_site_apps: true,
  });

  return (
    <div className="h-screen flex items-center justify-center">
      <Button id="beta-button">Feature Flags</Button>
      <Button
        onClick={() => {
          posthog.getEarlyAccessFeatures((featureFlags) => {
            featureFlags.map((featureFlag) => {
              const { flagKey } = featureFlag;
              const enabled = posthog.isFeatureEnabled(flagKey);

              if (enabled) {
                enableFeatureFlagCookie(flagKey);
              } else {
                deleteFeatureFlagCookie(flagKey);
              }
            });
          });
        }}
      >
        Save
      </Button>
    </div>
  );
}
