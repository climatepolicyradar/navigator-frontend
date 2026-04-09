import { transformOldFamily } from "@/bff/transformers/partials/transformOldFamily";
import { TDocumentApiNewData, TDocumentApiOldData, TDocumentPresentationalResponse } from "@/types";

export const oldDocumentTransformer = (
  documentApiOldData: TDocumentApiOldData,
  documentApiNewData: TDocumentApiNewData,
  errors: Error[]
): TDocumentPresentationalResponse => {
  const { corpusTypes, family } = documentApiOldData;

  try {
    return {
      data: {
        ...documentApiOldData,
        family: transformOldFamily(family, corpusTypes),
      },
      errors,
    };
  } catch (error) {
    return { data: null, errors: [...errors, error as Error] };
  }
};
