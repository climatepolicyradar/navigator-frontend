import dynamic from "next/dynamic";

import { TDocumentPage, TLoadingStatus, TPassage } from "@/types";

import Loader from "./Loader";

// pdf.js requires browser-only APIs (DOMMatrix, canvas, etc.) so we must
// prevent Next.js from importing it during SSR.
const PDFViewer = dynamic(() => import("../pdf/PDFViewer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex justify-center">
      <Loader />
    </div>
  ),
});

interface IProps {
  document: TDocumentPage;
  documentPassageMatches?: TPassage[];
  pageNumber?: number;
  startingPageNumber?: number;
  searchStatus?: TLoadingStatus;
}

const EmbeddedPDF = ({ document, documentPassageMatches = [], pageNumber = null, startingPageNumber }: IProps) => {
  if (!document) {
    return (
      <div className="flex-1 flex justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <PDFViewer document={document} documentPassageMatches={documentPassageMatches} pageNumber={pageNumber} startingPageNumber={startingPageNumber} />
  );
};

export default EmbeddedPDF;
