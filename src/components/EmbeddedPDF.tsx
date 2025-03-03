import { useRef, useState, useMemo, useEffect, useContext } from "react";
import Script from "next/script";

import { AdobeContext } from "@context/AdobeContext";

import usePDFPreview from "@hooks/usePDFPreview";

import Loader from "./Loader";

import { TDocumentPage, TPassage } from "@types";

type TProps = {
  document: TDocumentPage;
  documentPassageMatches?: TPassage[];
  passageIndex?: number;
  startingPassageIndex?: number;
};

const EmbeddedPDF = ({ document, documentPassageMatches = [], passageIndex = null, startingPassageIndex = 0 }: TProps) => {
  const isLoading = useState(true);
  const containerRef = useRef(null);
  const adobeKey = useContext(AdobeContext);

  const pdfPreview = usePDFPreview(document, adobeKey);

  // Ensure the instance of the PDF client is not reset on re-render
  // otherwise we lose the ability to interact with the pdf
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { createPDFClient, passageIndexChangeHandler, documentMatchesChangeHandler } = useMemo(() => pdfPreview, [document, adobeKey]);

  useEffect(() => {
    if (containerRef?.current !== null) {
      createPDFClient();
    }
  }, [containerRef, document, createPDFClient]);

  useEffect(() => {
    passageIndexChangeHandler(passageIndex, documentPassageMatches);
    /* trunk-ignore(eslint/react-hooks/exhaustive-deps) */
  }, [passageIndexChangeHandler, passageIndex, JSON.stringify(documentPassageMatches)]);

  useEffect(() => {
    documentMatchesChangeHandler(documentPassageMatches, startingPassageIndex);
    /* trunk-ignore(eslint/react-hooks/exhaustive-deps) */
  }, [documentMatchesChangeHandler, JSON.stringify(documentPassageMatches)]);

  return (
    <>
      <Script src="https://acrobatservices.adobe.com/view-sdk/viewer.js" />
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
