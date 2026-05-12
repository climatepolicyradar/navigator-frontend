import { transformDocument } from "@/bff/transformers/partials/transformDocument";
import { transformDocumentFamily } from "@/bff/transformers/partials/transformDocumentFamily";
import { LABEL_TYPES, MANDATORY_DOCUMENT_LABEL_TYPES, TDataInLabel, TDataInLabelType } from "@/schemas";
import { TAttributionCategory, TDocumentApiData, TDocumentPresentationalResponse } from "@/types";
import { groupByType } from "@/utils/data-in/groupByType";

export const documentTransformer = (documentApiData: TDocumentApiData, errors: Error[]): TDocumentPresentationalResponse => {
  try {
    const { document, topicsData, vespaDocumentData } = documentApiData;
    const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(document.labels, LABEL_TYPES, MANDATORY_DOCUMENT_LABEL_TYPES);

    return {
      data: {
        document: transformDocument(document, []),
        family: transformDocumentFamily(document.documents || [], groupedLabels.category[0].value.value as TAttributionCategory),
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
