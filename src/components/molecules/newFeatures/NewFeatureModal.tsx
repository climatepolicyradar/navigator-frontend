import { useContext } from "react";

import { Button } from "@/components/atoms/button/Button";
import { Modal } from "@/components/molecules/modal/Modal";
import { NewFeatureContext } from "@/context/NewFeatureContext";
import { TNewFeatureButtonAction, TNewFeatureModal } from "@/types";

interface IProps {
  order: number;
  modal: TNewFeatureModal;
}

export const NewFeatureModal = ({ order, modal: { buttonPrimary, buttonSecondary, close, content, headerImage, title } }: IProps) => {
  const { displayNewFeature, setDisplayNewFeature, setPreviousNewFeature } = useContext(NewFeatureContext);

  if (displayNewFeature !== order) return null; // The modal hasn't been opened yet

  const buttonActions: Record<TNewFeatureButtonAction, () => void> = {
    dismiss: () => {
      setPreviousNewFeature(order);
      setDisplayNewFeature(-1);
    },
    showModal: () => null, // Nothing to do here!
  };

  return (
    <Modal isOpen={true} showCloseButton={close} onClose={buttonActions.dismiss} title={title} headerImage={headerImage}>
      {content}
      {(buttonPrimary || buttonSecondary) && (
        <div className="flex gap-2">
          {buttonPrimary && (
            <Button size="small" onClick={buttonActions[buttonPrimary.action]}>
              {buttonPrimary.text}
            </Button>
          )}
          {buttonSecondary && (
            <Button size="small" variant="ghost" onClick={buttonActions[buttonSecondary.action]}>
              {buttonSecondary.text}
            </Button>
          )}
        </div>
      )}
    </Modal>
  );
};
