import { getParentDocuments } from "@/bff/methods/getRelations";
import { transformDocument } from "@/bff/transformers/partials/transformDocument";
import { transformDocumentFamily } from "@/bff/transformers/partials/transformDocumentFamily";
import { TDocumentApiData, TDocumentPresentationalResponse } from "@/types";
import { toThemeCriteria } from "@/utils/getDocumentSites";

export const documentTransformer = (documentApiData: TDocumentApiData, errors: Error[]): TDocumentPresentationalResponse => {
  try {
    const { document } = documentApiData;

    const documentPublic = transformDocument(document, []);
    const parentDocument = getParentDocuments(document.documents || [])[0];
    const family = transformDocumentFamily(document.documents || []);
    // Non-displayable documents and documents without a parent family transform to null; the page treats null data as a 404
    if (documentPublic === null || family === null) return { data: null, errors };

    return {
      data: {
        document: documentPublic,
        family,
        themeCriteria: toThemeCriteria(parentDocument.value.labels),
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
