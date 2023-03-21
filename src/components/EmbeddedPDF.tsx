import { useRef, useMemo, useEffect, useContext } from "react";
import Script from "next/script";
import { TDocumentPage, TPassage } from "@types";
import usePDFPreview from "@hooks/usePDFPreview";
import Loader from "./Loader";
import { AdobeContext } from "@context/AdobeContext";

type TProps = {
  document: TDocumentPage;
  documentPassageMatches?: TPassage[];
  passageIndex?: number;
};

const EmbeddedPDF = ({ document, documentPassageMatches = [], passageIndex = null }: TProps) => {
  const containerRef = useRef();
  const adobeKey = useContext(AdobeContext);

  const pdfPreview = usePDFPreview(document, documentPassageMatches, adobeKey);
  
  // Ensure the instance of the PDF client is not reset on render 
  // otherwise we lose the ability to interact with the pdf
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { createPDFClient, passageIndexChangeHandler } = useMemo(() => pdfPreview, [document]);

  useEffect(() => {
    if (containerRef?.current) {
      createPDFClient();
    }
  }, [containerRef, document, createPDFClient]);

  useEffect(() => {
    passageIndexChangeHandler(passageIndex);
  }, [passageIndexChangeHandler, passageIndex]);

  return (
    <>
      <Script src="https://documentcloud.adobe.com/view-sdk/viewer.js" />
      {!document ? (
        <div className="w-full flex justify-center flex-1">
          <Loader />
        </div>
      ) : (
        <>
          <div ref={containerRef} id="pdf-div" className="h-full" data-analytics-document={document.content_type}></div>
        </>
      )}
    </>
  );
};
export default EmbeddedPDF;
