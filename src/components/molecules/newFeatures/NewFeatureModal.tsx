import { useContext } from "react";

import { Modal } from "@/components/molecules/modal/Modal";
import { NEW_FEATURES } from "@/constants/newFeatures";
import { NewFeatureContext } from "@/context/NewFeatureContext";

export const NewFeatureModal = () => {
  const { displayNewFeature, setDisplayNewFeature, setPreviousNewFeature } = useContext(NewFeatureContext);

  if (displayNewFeature === null) return null;

  const onCloseModal = () => {
    setPreviousNewFeature(displayNewFeature);
    setDisplayNewFeature(null);
  };

  const feature = NEW_FEATURES[displayNewFeature];

  if (displayNewFeature !== feature.order) {
    throw new Error(`New feature order (${feature.order}) doesn't match its index (${displayNewFeature})`);
  }

  return (
    <Modal isOpen={true} onClose={onCloseModal} title="New improvements">
      {feature.modalContent}
    </Modal>
  );
};
