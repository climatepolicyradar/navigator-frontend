import { transformOldFamily } from "@/bff/transformers/partials/transformOldFamily";
import { TDocumentApiNewData, TDocumentApiOldData, TDocumentPresentationalResponse } from "@/types";

export const oldDocumentTransformer = (
  documentApiOldData: TDocumentApiOldData,
  documentApiNewData: TDocumentApiNewData,
  errors: Error[]
): TDocumentPresentationalResponse => {
  const { family } = documentApiOldData.document;

  try {
    return {
      data: {
        ...documentApiOldData,
        document: {
          ...documentApiOldData.document,
          events: [],
        },
        family: transformOldFamily(family, {}),
        debug: {
          newApiData: documentApiNewData,
          usesDataIn: false,
        },
      },
      errors,
    };
  } catch (error) {
    return { data: null, errors: [...errors, error as Error] };
  }
};
