"use client";
import { usePostHog } from "posthog-js/react";

function FeatureFlags() {
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
    <div>
      <button id="beta-button">Public Betas</button>
    </div>
  );
}

export default FeatureFlags;
