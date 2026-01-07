import { useContext, useEffect } from "react";

import { CookieConsent } from "@/components/cookies/CookieConsent";
import { TutorialBanner } from "@/components/molecules/tutorials/TutorialBanner";
import { TutorialModal } from "@/components/molecules/tutorials/TutorialModal";
import { TUTORIALS } from "@/constants/tutorials";
import { ThemeContext } from "@/context/ThemeContext";
import { TutorialContext } from "@/context/TutorialContext";
import { getAllCookies } from "@/utils/cookies";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { getIncompleteTutorialNames } from "@/utils/tutorials";

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
  const features = getFeatures(themeConfig, featureFlags);

  const incompleteTutorials = getIncompleteTutorialNames(completedTutorials, themeConfig, features).map((tutorialName) => ({
    name: tutorialName,
    tutorial: TUTORIALS[tutorialName],
  }));

  // If any incomplete tutorial has a banner, show the next one in order
  const currentBanner = incompleteTutorials.find(({ tutorial }) => tutorial.banner);

  // If any incomplete tutorial has a modal, show the next one in order, but prioritise an initially open modal.
  const currentModal =
    incompleteTutorials.find(({ tutorial }) => tutorial.modal && tutorial.modal.defaultOpen) ||
    incompleteTutorials.find(({ tutorial }) => tutorial.modal);
  const displayCurrentModal = Boolean(displayTutorial === currentModal?.name);

  // If the current modal is defaultOpen, open it initially
  useEffect(() => {
    if (loaded && currentModal?.tutorial.modal.defaultOpen) setDisplayTutorial(currentModal.name);
  }, [currentModal, loaded, setDisplayTutorial]);

  return (
    <>
      {displayCurrentModal && currentModal && <TutorialModal name={currentModal.name} modal={currentModal.tutorial.modal} />}
      <div className="fixed z-1000 inset-0 pointer-events-none">
        <div className="flex flex-col-reverse h-full">
          {currentBanner && <TutorialBanner name={currentBanner.name} banner={currentBanner.tutorial.banner} />}
          <CookieConsent onConsentChange={onConsentChange} theme={theme} />
        </div>
      </div>
    </>
  );
};
