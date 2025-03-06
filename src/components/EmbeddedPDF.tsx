import { useRef, useState, useMemo, useEffect, useContext } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";

import { AdobeContext } from "@context/AdobeContext";

import usePDFPreview from "@hooks/usePDFPreview";

import Loader from "./Loader";

import { TDocumentPage, TLoadingStatus, TPassage } from "@types";

type TProps = {
  document: TDocumentPage;
  documentPassageMatches?: TPassage[];
  passageIndex?: number;
  startingPassageIndex?: number;
  searchStatus?: TLoadingStatus;
};

const EmbeddedPDF = ({ document, documentPassageMatches = [], passageIndex = null, startingPassageIndex = 0, searchStatus }: TProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const adobeKey = useContext(AdobeContext);

  const pdfPreview = usePDFPreview(document, adobeKey);

  // Ensure the instance of the PDF client is not reset on re-render
  // otherwise we lose the ability to interact with the pdf
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { changePage, addAnnotations } = useMemo(() => pdfPreview, [document, adobeKey]);

  useEffect(() => {
    changePage(passageIndex, documentPassageMatches);
  }, [changePage, passageIndex, documentPassageMatches]);

  useEffect(() => {
    setIsLoading(true);
    addAnnotations(documentPassageMatches, startingPassageIndex).finally(() => {
      setIsLoading(false);
    });
  }, [addAnnotations, documentPassageMatches, startingPassageIndex]);

  useEffect(() => {
    if (searchStatus === "loading") {
      return setIsLoading(true);
    }
    setIsLoading(false);
  }, [searchStatus, isLoading]);

  return (
    <>
      <Script src="https://acrobatservices.adobe.com/view-sdk/viewer.js" />
      {!document ? (
        <div className="w-full flex justify-center flex-1">
          <Loader />
        </div>
      ) : (
        <>
          <AnimatePresence initial={false}>
            {isLoading && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                exit={{ clipPath: "inset(0px 100% 0px 0px)" }}
                transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                className="w-full flex flex-col items-center gap-6 flex-1 absolute h-full bg-white pt-10"
              >
                <div className="w-[80px] h-[80px]">
                  <object className="radar" type="image/svg+xml" data="/images/radar-loader.svg" style={{ width: "80px", height: "80px" }} />
                </div>
                <div>Loading the PDF viewer</div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={containerRef} id="pdf-div" className="h-full" data-analytics-document={document.content_type}></div>
        </>
      )}
    </>
  );
};

export default EmbeddedPDF;
