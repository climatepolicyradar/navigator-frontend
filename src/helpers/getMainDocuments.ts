import { TDocumentPage } from "@/types";

// Please do not delete this file as it contains some important business logic around determining main documents
export const getMainDocuments = (documents: TDocumentPage[]): [TDocumentPage[], TDocumentPage[]] => {
  let mainDocuments: TDocumentPage[] = [];
  let otherDocuments: TDocumentPage[] = [];

  mainDocuments = documents.filter((doc) => doc.document_role && doc.document_role.toLowerCase().includes("main"));

  if (mainDocuments.length > 1) {
    mainDocuments = mainDocuments.filter((doc) => !doc.variant?.toLowerCase().includes("translation"));
  }

  if (mainDocuments.length > 1) {
    mainDocuments = mainDocuments.filter((doc) => doc.content_type?.toLowerCase().includes("application/pdf"));
  }

  otherDocuments = documents.filter((doc) => !mainDocuments.includes(doc));

  return [mainDocuments, otherDocuments];
};
