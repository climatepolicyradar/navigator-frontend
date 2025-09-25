import { useContext, useEffect } from "react";

import { CookieConsent } from "@/components/cookies/CookieConsent";
import { TutorialBanner } from "@/components/molecules/tutorials/TutorialBanner";
import { TutorialModal } from "@/components/molecules/tutorials/TutorialModal";
import { TUTORIALS } from "@/constants/tutorials";
import { ThemeContext } from "@/context/ThemeContext";
import { TutorialContext } from "@/context/TutorialContext";
import { getAllCookies } from "@/utils/cookies";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFirstIncompleteTutorialName } from "@/utils/tutorials";

interface IProps {
  onConsentChange: (consent: boolean) => void;
}

export const Overlays = ({ onConsentChange }: IProps) => {
  const { themeConfig, theme, loaded } = useContext(ThemeContext);
  const { completedTutorials, displayTutorial, setDisplayTutorial } = useContext(TutorialContext);

  let cookies: Record<string, string> = {};
  try {
    cookies = getAllCookies();
  } catch (_error) {}
  const featureFlags = getFeatureFlags(cookies);

  const currentTutorialName = loaded ? getFirstIncompleteTutorialName(completedTutorials, themeConfig, featureFlags) : null;
  const currentTutorial = currentTutorialName ? TUTORIALS[currentTutorialName] : null;
  const displayCurrentTutorial = displayTutorial === currentTutorialName;

  // If there is a defaultOpen modal, make it open initially if needed
  useEffect(() => {
    if (loaded && currentTutorial?.modal?.defaultOpen) setDisplayTutorial(currentTutorialName);
  }, [currentTutorial, currentTutorialName, loaded, setDisplayTutorial]);

  return (
    <>
      {displayCurrentTutorial && currentTutorial?.modal && <TutorialModal name={currentTutorialName} modal={currentTutorial.modal} />}
      <div className="fixed z-1000 inset-0 pointer-events-none">
        <div className="flex flex-col-reverse h-full">
          {currentTutorial?.banner && <TutorialBanner name={currentTutorialName} banner={currentTutorial.banner} />}
          <CookieConsent onConsentChange={onConsentChange} theme={theme} />
        </div>
      </div>
    </>
  );
};
