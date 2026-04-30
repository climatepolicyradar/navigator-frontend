import Script from "next/script";
import { useRef, useMemo, useEffect, useContext } from "react";

import { AdobeContext } from "@/context/AdobeContext";
import usePDFPreview from "@/hooks/usePDFPreview";
import { TFamilyDocumentPublic, TLoadingStatus, TPassage } from "@/types";

import Loader from "./Loader";

interface IProps {
  document: TFamilyDocumentPublic;
  documentPassageMatches?: TPassage[];
  pageNumber?: number;
  startingPageNumber?: number;
  searchStatus?: TLoadingStatus;
}

const EmbeddedPDF = ({ document, documentPassageMatches = [], pageNumber = null, startingPageNumber }: IProps) => {
  const containerRef = useRef(null);
  const adobeKey = useContext(AdobeContext);

  const pdfPreview = usePDFPreview(document, adobeKey);

  // Ensure the instance of the PDF client is not reset on re-render
  // otherwise we lose the ability to interact with the pdf

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { changePage, registerPassages } = useMemo(() => pdfPreview, [document, adobeKey]);

  useEffect(() => {
    if (pageNumber) changePage(pageNumber);
  }, [changePage, pageNumber]);

  useEffect(() => {
    registerPassages(documentPassageMatches, startingPageNumber).finally(() => {});
  }, [registerPassages, documentPassageMatches, startingPageNumber]);

  return (
    <>
      <Script src="https://acrobatservices.adobe.com/view-sdk/viewer.js" />
      {!document ? (
        <div className="flex-1 flex justify-center">
          <Loader />
        </div>
      ) : (
        <div ref={containerRef} id="pdf-div" className="h-full" data-analytics-document={document.content_type}></div>
      )}
    </>
  );
};

export default EmbeddedPDF;
