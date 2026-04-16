import { transformOldFamily } from "@/bff/transformers/partials/transformOldFamily";
import { TDocumentApiNewData, TDocumentApiOldData, TDocumentPresentationalResponse } from "@/types";

export const oldDocumentTransformer = (
  documentApiOldData: TDocumentApiOldData,
  documentApiNewData: TDocumentApiNewData,
  errors: Error[]
): TDocumentPresentationalResponse => {
  const { family } = documentApiOldData;

  try {
    return {
      data: {
        ...documentApiOldData,
        family: transformOldFamily(family, {}),
      },
      errors,
    };
  } catch (error) {
    return { data: null, errors: [...errors, error as Error] };
  }
};
