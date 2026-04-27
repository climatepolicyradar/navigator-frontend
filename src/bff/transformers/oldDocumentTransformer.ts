import { transformOldFamily } from "@/bff/transformers/partials/transformOldFamily";
import { TDocumentApiOldData, TDocumentPresentationalResponse } from "@/types";

export const oldDocumentTransformer = (documentApiOldData: TDocumentApiOldData, errors: Error[]): TDocumentPresentationalResponse => {
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
      },
      errors,
    };
  } catch (error) {
    return { data: null, errors: [...errors, error as Error] };
  }
};
