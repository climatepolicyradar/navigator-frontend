import { oldDocumentTransformer } from "@/bff/transformers/oldDocumentTransformer";
import { transformDocument } from "@/bff/transformers/partials/transformDocument";
import { transformDocumentFamily } from "@/bff/transformers/partials/transformDocumentFamily";
import { TDocumentApiNewData, TDocumentApiOldData, TDocumentPresentationalResponse } from "@/types";

export const documentTransformer = (
  documentApiOldData: TDocumentApiOldData,
  documentApiNewData: TDocumentApiNewData,
  errors: Error[]
): TDocumentPresentationalResponse => {
  if (documentApiOldData === null) return { data: null, errors };

  if (documentApiNewData) {
    try {
      const document = transformDocument(documentApiNewData, []);
      if (!document) return { data: null, errors };

      return {
        data: {
          ...documentApiOldData,
          document,
          family: transformDocumentFamily(documentApiNewData.documents || []),
          debug: {
            originalDocument: documentApiOldData.document,
            newApiData: documentApiNewData,
            usesDataIn: true,
          },
        },
        errors,
      };
    } catch (error) {
      return oldDocumentTransformer(documentApiOldData, documentApiNewData, [...errors, error as Error]);
    }
  } else {
    return oldDocumentTransformer(documentApiOldData, documentApiNewData, errors);
  }
};
