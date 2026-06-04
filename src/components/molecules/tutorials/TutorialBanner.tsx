import { useContext } from "react";

import { TutorialButton } from "@/components/molecules/tutorials/TutorialButton";
import { TutorialContext } from "@/context/TutorialContext";
import { TTutorialBanner, TTutorialButtonAction, TTutorialName } from "@/types";

interface IProps {
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
    <div className="flex gap-x-4 gap-y-3 justify-center items-center flex-wrap p-3 bg-[#005eeb] pointer-events-auto select-none">
      <span className="text-sm leading-normal text-text-inverse">{text}</span>
      <div className="flex gap-2">
        <TutorialButton
          {...buttonPrimary}
          actions={buttonActions}
          name={name}
          use="banner"
          className="border-text-inverse/75 hover:border-text-inverse hover:bg-transparent! text-text-inverse"
        />
        {buttonSecondary && (
          <TutorialButton
            {...buttonSecondary}
            actions={buttonActions}
            name={name}
            use="banner"
            className="text-text-inverse/75 hover:text-text-inverse hover:bg-transparent!"
          />
        )}
      </div>
    </div>
  );
};
