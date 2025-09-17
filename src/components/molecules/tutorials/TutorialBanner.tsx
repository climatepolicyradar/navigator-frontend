import { useContext } from "react";

import { Button } from "@/components/atoms/button/Button";
import { TutorialContext } from "@/context/TutorialContext";
import { TTutorialBanner, TTutorialButtonAction } from "@/types";

export interface IProps {
  order: number;
  banner: TTutorialBanner;
}

export const TutorialBanner = ({ order, banner: { buttonPrimary, buttonSecondary, text } }: IProps) => {
  const { previousTutorial, setDisplayTutorial, setPreviousTutorial } = useContext(TutorialContext);

  if (previousTutorial === null || previousTutorial >= order) return null;

  const buttonActions: Record<TTutorialButtonAction, () => void> = {
    dismiss: () => setPreviousTutorial(order),
    showModal: () => setDisplayTutorial(order),
  };

  return (
    <div className="flex gap-x-4 gap-y-3 justify-center items-center flex-wrap p-3 bg-surface-brand pointer-events-auto select-none">
      <span className="text-sm leading-normal text-text-light">{text}</span>
      <div className="flex gap-2">
        <Button
          className="border-border-light/75 hover:border-border-light hover:!bg-transparent text-text-light"
          size="small"
          variant={buttonPrimary.variant || "outlined"}
          color={buttonPrimary.color || "brand"}
          onClick={buttonActions[buttonPrimary.action]}
        >
          {buttonPrimary.text}
        </Button>
        {buttonSecondary && (
          <Button
            className="text-text-light/75 hover:text-text-light hover:!bg-transparent"
            size="small"
            variant={buttonSecondary.variant || "ghost"}
            color={buttonSecondary.color || "brand"}
            onClick={buttonActions[buttonSecondary.action]}
          >
            {buttonSecondary.text}
          </Button>
        )}
      </div>
    </div>
  );
};
