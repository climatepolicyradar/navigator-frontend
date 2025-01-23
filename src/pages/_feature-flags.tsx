import Button from "@components/buttons/Button";
import { setFeatureFlags } from "@utils/featureFlags";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

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

  useEffect(() => {
    /** This runs when the feature flags on changed in the posthog UI */
    posthog.onFeatureFlags((posthogFeatureFlags) => {
      const featureFlags = {};
      posthogFeatureFlags.map((posthogFeatureFlag) => {
        featureFlags[posthogFeatureFlag] = true;
      });
      setFeatureFlags(featureFlags);
    });
  }, [posthog]);

  return (
    <div className="h-screen flex items-center justify-center gap-4">
      <Button id="beta-button">Set My Feature Flags</Button>
    </div>
  );
}
