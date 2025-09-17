import { useContext } from "react";

import { CookieConsent } from "@/components/cookies/CookieConsent";
import { TutorialBanner } from "@/components/molecules/tutorials/TutorialBanner";
import { TutorialModal } from "@/components/molecules/tutorials/TutorialModal";
import { TUTORIALS } from "@/constants/tutorials";
import { ThemeContext } from "@/context/ThemeContext";
import { TutorialContext } from "@/context/TutorialContext";
import { TTutorial } from "@/types";
import { getAllCookies } from "@/utils/cookies";
import { getFeatureFlags } from "@/utils/featureFlags";

interface IProps {
  onConsentChange: (consent: boolean) => void;
}

export const Overlays = ({ onConsentChange }: IProps) => {
  const { theme, themeConfig, loaded } = useContext(ThemeContext);
  const { displayTutorial, previousTutorial, setDisplayTutorial } = useContext(TutorialContext);

  let cookies: Record<string, string> = {};
  try {
    cookies = getAllCookies();
  } catch (_error) {}
  const featureFlags = getFeatureFlags(cookies);

  // TODO make a function & step through each new feature in turn
  // Only determine the latest feature after themeConfig loads, or a different feature may appear briefly
  let latestFeature: TTutorial = null;
  if (loaded) {
    latestFeature = [...TUTORIALS].reverse().find((feature) => feature.isEnabled(featureFlags, themeConfig, theme)) || null;

    // If there is a defaultOpen modal, make it open initially if needed
    if (latestFeature?.modal.defaultOpen && previousTutorial < latestFeature.order && displayTutorial !== -1) {
      setDisplayTutorial(latestFeature.order);
    }
  }

  return (
    <>
      {latestFeature?.modal && <TutorialModal order={latestFeature.order} modal={latestFeature.modal} />}
      <div className="fixed z-1000 inset-0 pointer-events-none">
        <div className="flex flex-col-reverse h-full">
          {latestFeature?.banner && <TutorialBanner order={latestFeature.order} banner={latestFeature.banner} />}
          <CookieConsent onConsentChange={onConsentChange} />
        </div>
      </div>
    </>
  );
};
