import { oldDocumentTransformer } from "@/bff/transformers/oldDocumentTransformer";
import { transformDocument } from "@/bff/transformers/partials/transformDocument";
import { transformDocumentFamily } from "@/bff/transformers/partials/transformDocumentFamily";
import { LABEL_TYPES, MANDATORY_DOCUMENT_LABEL_TYPES, TDataInLabel, TDataInLabelType } from "@/schemas";
import { TAttributionCategory, TDocumentApiNewData, TDocumentApiOldData, TDocumentPresentationalResponse } from "@/types";
import { groupByType } from "@/utils/data-in/groupByType";

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

      const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(documentApiNewData.labels, LABEL_TYPES, MANDATORY_DOCUMENT_LABEL_TYPES);

      return {
        data: {
          ...documentApiOldData,
          document,
          family: transformDocumentFamily(documentApiNewData.documents || [], groupedLabels.category[0].value.value as TAttributionCategory),
        },
        errors,
      };
    } catch (error) {
      return oldDocumentTransformer(documentApiOldData, [...errors, error as Error]);
    }
  } else {
    return oldDocumentTransformer(documentApiOldData, errors);
  }
};
