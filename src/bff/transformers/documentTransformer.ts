import { isOldDocumentApiData, TDocumentApiData, TDocumentPresentationalResponse } from "@/types";

export const documentTransformer = (documentApiData: TDocumentApiData, errors: Error[]): TDocumentPresentationalResponse => {
  if (documentApiData === null) return { data: null, errors };

  const isOldData = isOldDocumentApiData(documentApiData);

  if (isOldData) {
    // Because the old API data type satisfies the presentational data type, no changes are needed
    return { data: documentApiData, errors };
  } else {
    // TODO: introduce transformations for new data model API data
    return { data: null, errors };
  }
};
