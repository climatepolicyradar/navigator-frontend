import { useContext } from "react";

import { Modal } from "@/components/molecules/modal/Modal";
import { TutorialContext } from "@/context/TutorialContext";
import { TFeatures, TTutorialButtonAction, TTutorialModal, TTutorialName } from "@/types";

interface IProps {
  name: TTutorialName;
  modal: TTutorialModal;
  features: TFeatures;
}

export const TutorialModal = ({ name, modal: { getModalProps }, features }: IProps) => {
  const { addCompletedTutorial, displayTutorial, setDisplayTutorial } = useContext(TutorialContext);

  if (displayTutorial !== name) return null; // The modal hasn't been opened yet

  const actions: Record<TTutorialButtonAction, () => void> = {
    dismiss: () => {
      addCompletedTutorial(name);
      setDisplayTutorial(null);
    },
    showModal: () => null, // Nothing to do here!
  };

  const { children, ...modalProps } = getModalProps({ actions, features, name });

  return (
    <Modal isOpen={true} onClose={actions.dismiss} {...modalProps}>
      {children}
    </Modal>
  );
};
