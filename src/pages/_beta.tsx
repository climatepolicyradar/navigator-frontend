"use client";
import { usePostHog } from "posthog-js/react";
import { useState, useEffect } from "react";

function Beta() {
  const posthog = usePostHog();
  /**
   * This key is a public key.
   * @see: https://posthog.com/docs/privacy#is-it-ok-for-my-api-key-to-be-exposed-and-public
   */
  posthog.init("phc_zaZYaLxsAeMjCLPsU2YvFqu4oaXRJ8uAkgXY8DancyL", {
    api_host: "https://eu.i.posthog.com",
    opt_in_site_apps: true,
  });

  const [earlyAccessFeatures, setEarlyAccessFeatures] = useState([]);
  useEffect(() => {
    posthog.getEarlyAccessFeatures((features) => {
      setEarlyAccessFeatures(features);
    }, true);
  }, [posthog]);

  const toggleBetaOff = (betaKey: string) => {
    posthog.updateEarlyAccessFeatureEnrollment(betaKey, false);
  };

  const toggleBetaOn = (betaKey: string) => {
    posthog.updateEarlyAccessFeatureEnrollment(betaKey, true);
  };

  return (
    <div>
      <h1>Available Early Access Features</h1>
      <h3>Inactive</h3>
      {earlyAccessFeatures.map((beta) => (
        <div key={beta.id}>
          {beta.name} - <button onClick={() => toggleBetaOn(beta.flagKey)}>Opt In</button>
        </div>
      ))}
      <h3>Active</h3>
      {earlyAccessFeatures.map((beta) => (
        <div key={beta.id}>
          {beta.name} - <button onClick={() => toggleBetaOff(beta.flagKey)}>Opt Out</button>
        </div>
      ))}
      <button id="beta-button">Public Betas</button>
    </div>
  );
}

export default Beta;
