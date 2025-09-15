import { useContext } from "react";

import { CookieConsent } from "@/components/cookies/CookieConsent";
import { NewFeatureBanner } from "@/components/molecules/newFeatures/NewFeatureBanner";
import { NewFeatureModal } from "@/components/molecules/newFeatures/NewFeatureModal";
import { NEW_FEATURES } from "@/constants/newFeatures";
import { NewFeatureContext } from "@/context/NewFeatureContext";
import { ThemeContext } from "@/context/ThemeContext";
import { TNewFeature } from "@/types";
import { getAllCookies } from "@/utils/cookies";
import { getFeatureFlags } from "@/utils/featureFlags";

interface IProps {
  onConsentChange: (consent: boolean) => void;
}

export const Overlays = ({ onConsentChange }: IProps) => {
  const { theme, themeConfig, loaded } = useContext(ThemeContext);
  const { displayNewFeature, setDisplayNewFeature, previousNewFeature } = useContext(NewFeatureContext);

  let cookies: Record<string, string> = {};
  try {
    cookies = getAllCookies();
  } catch (_error) {}
  const featureFlags = getFeatureFlags(cookies);

  // Only determine the latest feature after themeConfig loads, or a different feature may appear briefly
  let latestFeature: TNewFeature = null;
  if (loaded) {
    latestFeature = [...NEW_FEATURES].reverse().find((feature) => feature.isEnabled(featureFlags, themeConfig, theme)) || null;

    // If there is a defaultOpen modal, make it open initially if needed
    if (latestFeature?.modal.defaultOpen && previousNewFeature < latestFeature.order && displayNewFeature !== -1) {
      setDisplayNewFeature(latestFeature.order);
    }
  }

  return (
    <>
      {latestFeature?.modal && <NewFeatureModal order={latestFeature.order} modal={latestFeature.modal} />}
      <div className="fixed z-1000 inset-0 pointer-events-none">
        <div className="flex flex-col-reverse h-full">
          {latestFeature?.banner && <NewFeatureBanner order={latestFeature.order} banner={latestFeature.banner} />}
          <CookieConsent onConsentChange={onConsentChange} />
        </div>
      </div>
    </>
  );
};
