import { Card } from "@/components/atoms/card/Card";
import { Modal } from "@/components/molecules/modal/Modal";
import { COOKIE_FEATURES_NAME } from "@/constants/cookies";
import { LATEST_FEATURE } from "@/constants/newFeatures";
import { getCookie, setCookie } from "@/utils/cookies";
import getDomain from "@/utils/getDomain";
import { useEffect, useState } from "react";
import { LuX } from "react-icons/lu";

export const NewFeatures = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [latestUpdateIsNew, setLatestUpdateIsNew] = useState(false);

  const { featureValue, modalContent, modalTitle, popupCTA, popupDescription, popupTitle } = LATEST_FEATURE;

  // Check if there is an update to show the user
  useEffect(() => {
    const updateCookie = parseInt(getCookie(COOKIE_FEATURES_NAME));
    const lastSeenUpdate = Number.isNaN(updateCookie) ? 0 : updateCookie;

    if (lastSeenUpdate < featureValue) {
      setLatestUpdateIsNew(true);
    }
  }, [featureValue]);

  const markUpdateSeen = () => {
    setCookie(COOKIE_FEATURES_NAME, featureValue.toString(), getDomain());
    setLatestUpdateIsNew(false);
  };

  const onModalClose = () => {
    setModalIsOpen(false);
    markUpdateSeen();
  };

  return (
    <>
      {/* Call to action */}
      {latestUpdateIsNew && (
        <div className="fixed inset-0 z-90 p-4 flex flex-col justify-end pointer-events-none">
          <Card className="max-w-[300px] !p-4 flex items-start gap-2 pointer-events-auto select-none">
            <div>
              {popupTitle && <h4 className="font-bold">{popupTitle}</h4>}
              <p className="my-3">{popupDescription}</p>
              <a href="#" onClick={() => setModalIsOpen(true)} className="underline">
                {popupCTA}
              </a>
            </div>
            <button onClick={() => markUpdateSeen()}>
              <LuX height="16" width="16" />
            </button>
          </Card>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalIsOpen} onClose={onModalClose} cardClasses="">
        <div className="h-full flex flex-col gap-4">
          <h1 className="text-2xl font-medium">{modalTitle}</h1>
          <div className="h-full pr-2 overflow-y-auto">
            <div className="flex flex-col items-center gap-6 overflow-y-auto">{modalContent}</div>
          </div>
        </div>
      </Modal>
    </>
  );
};
