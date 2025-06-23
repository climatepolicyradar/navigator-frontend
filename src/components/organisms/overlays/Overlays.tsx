import { useContext } from "react";

import { CookieConsent } from "@/components/cookies/CookieConsent";
import { NewFeatureBanner } from "@/components/molecules/newFeatures/NewFeatureBanner";
import { NewFeatureModal } from "@/components/molecules/newFeatures/NewFeatureModal";
import { NEW_FEATURES } from "@/constants/newFeatures";
import { ThemeContext } from "@/context/ThemeContext";
import { getAllCookies } from "@/utils/cookies";
import { getFeatureFlags } from "@/utils/featureFlags";
import { isKnowledgeGraphEnabled } from "@/utils/features";

interface IProps {
  onConsentChange: (consent: boolean) => void;
}

export const Overlays = ({ onConsentChange }: IProps) => {
  const { themeConfig } = useContext(ThemeContext);

  let cookies: Record<string, string> = {};
  try {
    cookies = getAllCookies();
  } catch (_error) {}
  const featureFlags = getFeatureFlags(cookies);

  const knowledgeGraphIsEnabled = isKnowledgeGraphEnabled(featureFlags, themeConfig);

  return (
    <>
      <NewFeatureModal />
      <div className="fixed z-1000 inset-0 pointer-events-none">
        <div className="flex flex-col-reverse h-full">
          {knowledgeGraphIsEnabled && <NewFeatureBanner newFeature={NEW_FEATURES[0]} />}
          <CookieConsent onConsentChange={onConsentChange} />
        </div>
      </div>
    </>
  );
};
