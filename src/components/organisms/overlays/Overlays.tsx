import { CookieConsent } from "@/components/cookies/CookieConsent";
import { NewFeatureBanner } from "@/components/molecules/newFeatures/NewFeatureBanner";
import { NewFeatureModal } from "@/components/molecules/newFeatures/NewFeatureModal";
import { NEW_FEATURES } from "@/constants/newFeatures";

interface IProps {
  onConsentChange: (consent: boolean) => void;
}

export const Overlays = ({ onConsentChange }: IProps) => {
  return (
    <>
      <NewFeatureModal />
      <div className="fixed z-1000 inset-0 pointer-events-none">
        <div className="flex flex-col-reverse h-full">
          <NewFeatureBanner newFeature={NEW_FEATURES[0]} />
          <CookieConsent onConsentChange={onConsentChange} />
        </div>
      </div>
    </>
  );
};
