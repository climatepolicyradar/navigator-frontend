import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import { useRef, useState, useMemo, useEffect, useContext } from "react";

import { AdobeContext } from "@/context/AdobeContext";
import usePDFPreview from "@/hooks/usePDFPreview";
import { TDocumentPage, TLoadingStatus, TPassage } from "@/types";

import Loader from "./Loader";

interface IProps {
  document: TDocumentPage;
  documentPassageMatches?: TPassage[];
  pageNumber?: number;
  startingPageNumber?: number;
  searchStatus?: TLoadingStatus;
}

const EmbeddedPDF = ({ document, documentPassageMatches = [], pageNumber = null, startingPageNumber, searchStatus }: IProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);
  const adobeKey = useContext(AdobeContext);

  const pdfPreview = usePDFPreview(document, adobeKey);

  // Ensure the instance of the PDF client is not reset on re-render
  // otherwise we lose the ability to interact with the pdf
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { changePage, registerPassages } = useMemo(() => pdfPreview, [document, adobeKey]);

  useEffect(() => {
    pageNumber && changePage(pageNumber);
  }, [changePage, pageNumber]);

  useEffect(() => {
    setIsLoading(true);
    registerPassages(documentPassageMatches, startingPageNumber).finally(() => {
      setIsLoading(false);
    });
  }, [registerPassages, documentPassageMatches, startingPageNumber]);

  return (
    <>
      <Script src="https://acrobatservices.adobe.com/view-sdk/viewer.js" />
      {!document ? (
        <div className="flex-1 flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* <AnimatePresence initial={false}>
            {(searchStatus === "loading" || isLoading) && (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.95, clipPath: "inset(0 0 0 0)" }}
                exit={{ clipPath: "inset(0px 100% 0px 0px)" }}
                transition={{ duration: 0.5, ease: [0.77, 0, 0.175, 1] }}
                className="flex flex-col items-center gap-6 flex-1 absolute left-0 right-0 bottom-0 top-0 h-full bg-white pt-10 z-100"
              >
                <div className="w-[80px] h-[80px]">
                  <object className="radar" type="image/svg+xml" data="/images/radar-loader.svg" style={{ width: "80px", height: "80px" }} />
                </div>
                <div>Loading the PDF viewer</div>
              </motion.div>
            )}
          </AnimatePresence> */}
          <div ref={containerRef} id="pdf-div" className="h-full" data-analytics-document={document.content_type}></div>
        </>
      )}
    </>
  );
};

export default EmbeddedPDF;
