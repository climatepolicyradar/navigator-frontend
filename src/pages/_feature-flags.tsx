import Button from "@components/buttons/Button";
import { setFeatureFlags } from "@utils/featureFlags";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export default function FeatureFlags() {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.onFeatureFlags((featureFlags) => {
      const newFeatureFlags = {};
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
