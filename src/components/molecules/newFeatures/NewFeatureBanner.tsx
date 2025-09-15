import { useContext } from "react";

import { Button } from "@/components/atoms/button/Button";
import { NewFeatureContext } from "@/context/NewFeatureContext";
import { TNewFeatureBanner, TNewFeatureButtonAction } from "@/types";

export interface IProps {
  order: number;
  banner: TNewFeatureBanner;
}

export const NewFeatureBanner = ({ order, banner: { buttonPrimary, buttonSecondary, text } }: IProps) => {
  const { previousNewFeature, setDisplayNewFeature, setPreviousNewFeature } = useContext(NewFeatureContext);

  if (previousNewFeature === null || previousNewFeature >= order) return null;

  const buttonActions: Record<TNewFeatureButtonAction, () => void> = {
    dismiss: () => setPreviousNewFeature(order),
    showModal: () => setDisplayNewFeature(order),
  };

  return (
    <div className="flex gap-x-4 gap-y-3 justify-center items-center flex-wrap p-3 bg-surface-brand pointer-events-auto select-none">
      <span className="text-sm leading-normal text-text-light">{text}</span>
      <div className="flex gap-2">
        <Button
          size="small"
          variant="outlined"
          className="border-border-light/75 hover:border-border-light hover:!bg-transparent text-text-light"
          onClick={buttonActions[buttonPrimary.action]}
        >
          {buttonPrimary.text}
        </Button>
        {buttonSecondary && (
          <Button
            size="small"
            variant="ghost"
            className="text-text-light/75 hover:text-text-light hover:!bg-transparent"
            onClick={buttonActions[buttonSecondary.action]}
          >
            {buttonSecondary.text}
          </Button>
        )}
      </div>
    </div>
  );
};
