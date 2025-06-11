import { useContext } from "react";

import { Button } from "@/components/atoms/button/Button";
import { INewFeature } from "@/constants/newFeatures";
import { NewFeatureContext } from "@/context/NewFeatureContext";

interface IProps {
  newFeature: INewFeature;
}

export const NewFeatureBanner = ({ newFeature: { bannerText, order } }: IProps) => {
  const { previousNewFeature, setDisplayNewFeature, setPreviousNewFeature } = useContext(NewFeatureContext);

  if (previousNewFeature === null || previousNewFeature >= order) return null;

  return (
    <div className="flex gap-x-4 gap-y-3 justify-center items-center flex-wrap p-3 bg-surface-brand pointer-events-auto select-none">
      <span className="text-sm leading-normal text-text-light">{bannerText}</span>
      <div className="flex gap-2">
        <Button
          size="small"
          variant="outlined"
          className="border-border-light/75 hover:border-border-light hover:!bg-transparent text-text-light"
          onClick={() => setDisplayNewFeature(order)}
        >
          Learn more
        </Button>
        <Button
          size="small"
          variant="ghost"
          className="text-text-light/75 hover:text-text-light hover:!bg-transparent"
          onClick={() => setPreviousNewFeature(order)}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
};
