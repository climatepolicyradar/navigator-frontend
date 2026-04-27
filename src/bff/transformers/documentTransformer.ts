import { oldDocumentTransformer } from "@/bff/transformers/oldDocumentTransformer";
import { TDocumentApiOldData, TDocumentPresentationalResponse, TFamilyApiNewData } from "@/types";

export const documentTransformer = (
  documentApiOldData: TDocumentApiOldData,
  documentApiNewData: TFamilyApiNewData,
  errors: Error[]
): TDocumentPresentationalResponse => {
  if (documentApiOldData === null) return { data: null, errors };

  if (documentApiNewData) {
    // TODO: introduce transformations for new data model API data
    return { data: null, errors };
  } else {
    // Because the old API data type satisfies the presentational data type, no changes are needed
    return oldDocumentTransformer(documentApiOldData, errors);
  }
};
