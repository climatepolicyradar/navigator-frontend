import { useContext } from "react";

import { TutorialButton } from "@/components/molecules/tutorials/TutorialButton";
import { TutorialContext } from "@/context/TutorialContext";
import { TTutorialBanner, TTutorialButtonAction, TTutorialName } from "@/types";

export interface IProps {
  name: TTutorialName;
  banner: TTutorialBanner;
}

export const TutorialBanner = ({ name, banner: { buttonPrimary, buttonSecondary, text } }: IProps) => {
  const { addCompletedTutorial, setDisplayTutorial } = useContext(TutorialContext);

  const buttonActions: Record<TTutorialButtonAction, () => void> = {
    dismiss: () => addCompletedTutorial(name),
    showModal: () => setDisplayTutorial(name),
  };

  return (
    <div className="flex gap-x-4 gap-y-3 justify-center items-center flex-wrap p-3 bg-surface-brand pointer-events-auto select-none">
      <span className="text-sm leading-normal text-text-light">{text}</span>
      <div className="flex gap-2">
        <TutorialButton
          {...buttonPrimary}
          actions={buttonActions}
          className="border-border-light/75 hover:border-border-light hover:bg-transparent! text-text-light"
        />
        {buttonSecondary && (
          <TutorialButton {...buttonSecondary} actions={buttonActions} className="text-text-light/75 hover:text-text-light hover:bg-transparent!" />
        )}
      </div>
    </div>
  );
};
