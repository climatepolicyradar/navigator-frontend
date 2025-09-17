import { useContext } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Modal } from "@/components/molecules/modal/Modal";
import { TutorialContext } from "@/context/TutorialContext";
import { TTutorialButtonAction, TTutorialModal } from "@/types";

interface IProps {
  order: number;
  modal: TTutorialModal;
}

export const TutorialModal = ({ order, modal: { buttonPrimary, buttonSecondary, close, content, headerImage, title } }: IProps) => {
  const { displayTutorial, setDisplayTutorial, setPreviousTutorial } = useContext(TutorialContext);

  if (displayTutorial !== order) return null; // The modal hasn't been opened yet

  const buttonActions: Record<TTutorialButtonAction, () => void> = {
    dismiss: () => {
      setPreviousTutorial(order);
      setDisplayTutorial(-1);
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
