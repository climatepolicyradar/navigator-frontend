import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

import { Button } from "@/components/atoms/button/Button";
import { setFeatureFlags } from "@/utils/featureFlags";

export default function FeatureFlags() {
  const posthog = usePostHog();

  useEffect(() => {
    /**
     * This key is a public key.
     * @see: https://posthog.com/docs/privacy#is-it-ok-for-my-api-key-to-be-exposed-and-public
     */
    posthog.init("phc_zaZYaLxsAeMjCLPsU2YvFqu4oaXRJ8uAkgXY8DancyL", {
      api_host: "https://eu.i.posthog.com",
      opt_in_site_apps: true, // enables the beta feature popup
    });

    posthog.onFeatureFlags((featureFlags) => {
      const newFeatureFlags: { [key: string]: boolean } = {};
      for (const featureFlag of featureFlags) {
        newFeatureFlags[featureFlag] = true;
      }

      setFeatureFlags(newFeatureFlags);
    });
  }, [posthog]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Button id="beta-button">Feature Flags</Button>
        <p className="text-sm">You will need to have consented to cookies and have your ad-blocker disabled</p>
      </div>
    </div>
  );
}
