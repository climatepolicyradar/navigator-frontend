import { useContext } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Modal } from "@/components/molecules/modal/Modal";
import { TutorialContext } from "@/context/TutorialContext";
import { TTutorialButtonAction, TTutorialModal, TTutorialName } from "@/types";

interface IProps {
  name: TTutorialName;
  modal: TTutorialModal;
}

export const TutorialModal = ({ name, modal: { buttonPrimary, buttonSecondary, close, content, headerImage, title } }: IProps) => {
  const { addCompletedTutorial, displayTutorial, setDisplayTutorial } = useContext(TutorialContext);

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
      {content}
      {(buttonPrimary || buttonSecondary) && (
        <div className="flex gap-2">
          {buttonPrimary && (
            <Button
              size="small"
              variant={buttonPrimary.variant || "solid"}
              color={buttonPrimary.color || "brand"}
              onClick={buttonActions[buttonPrimary.action]}
            >
              {buttonPrimary.text}
            </Button>
          )}
          {buttonSecondary && (
            <Button
              size="small"
              variant={buttonSecondary.variant || "ghost"}
              color={buttonSecondary.color || "brand"}
              onClick={buttonActions[buttonSecondary.action]}
            >
              {buttonSecondary.text}
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
};
