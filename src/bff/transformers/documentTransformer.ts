import { transformDocument } from "@/bff/transformers/partials/transformDocument";
import { transformDocumentFamily } from "@/bff/transformers/partials/transformDocumentFamily";
import { TDocumentApiData, TDocumentPresentationalResponse } from "@/types";

export const documentTransformer = (documentApiData: TDocumentApiData, errors: Error[]): TDocumentPresentationalResponse => {
  try {
    const { document, topicsData, vespaDocumentData } = documentApiData;

    return {
      data: {
        document: transformDocument(document, []),
        family: transformDocumentFamily(document.documents || []),
        topicsData,
        vespaDocumentData,
        debug: {
          dataInDocument: document,
        },
      },
      errors,
    };
  } catch (error) {
    return { data: null, errors: [...errors, error as Error] };
  }
};
