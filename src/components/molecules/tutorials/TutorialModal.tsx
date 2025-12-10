import { useContext } from "react";

import { Modal } from "@/components/molecules/modal/Modal";
import { TutorialButton } from "@/components/molecules/tutorials/TutorialButton";
import { ThemeContext } from "@/context/ThemeContext";
import { TutorialContext } from "@/context/TutorialContext";
import { TTutorialButtonAction, TTutorialModal, TTutorialName } from "@/types";

interface IProps {
  name: TTutorialName;
  modal: TTutorialModal;
}

export const TutorialModal = ({ name, modal: { buttonPrimary, buttonSecondary, close, content, headerImage, title } }: IProps) => {
  const { addCompletedTutorial, displayTutorial, setDisplayTutorial } = useContext(TutorialContext);
  const { theme } = useContext(ThemeContext);

  if (displayTutorial !== name) return null; // The modal hasn't been opened yet

  const buttonActions: Record<TTutorialButtonAction, () => void> = {
    dismiss: () => {
      addCompletedTutorial(name);
      setDisplayTutorial(null);
    },
    showModal: () => null, // Nothing to do here!
  };

  return (
    <Modal isOpen={true} showCloseButton={close} onClose={buttonActions.dismiss} title={title} headerImage={headerImage}>
      {content(theme)}
      {(buttonPrimary || buttonSecondary) && (
        <div className="flex gap-2">
          {buttonPrimary && <TutorialButton {...buttonPrimary} actions={buttonActions} />}
          {buttonSecondary && <TutorialButton {...buttonSecondary} actions={buttonActions} />}
        </div>
      )}
    </Modal>
  );
};
