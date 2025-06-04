import { NewFeatureBanner } from "@/components/molecules/newFeatures/NewFeatureBanner";
import { LATEST_FEATURE } from "@/constants/newFeatures";

export const Overlays = () => {
  return (
    <div className="fixed z-1000 inset-0 pointer-events-none">
      <div className="flex flex-col-reverse h-full">
        <NewFeatureBanner newFeature={LATEST_FEATURE} />
      </div>
    </div>
  );
};
