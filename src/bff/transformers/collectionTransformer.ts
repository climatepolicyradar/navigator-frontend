import { isOldCollectionApiData, TCollectionApiData, TCollectionPresentationalResponse } from "@/types";

export const collectionTransformer = (collectionApiData: TCollectionApiData, errors: Error[]): TCollectionPresentationalResponse => {
  if (collectionApiData === null) return { data: null, errors };

  const isOldData = isOldCollectionApiData(collectionApiData);

  if (isOldData) {
    // Because the old API data type satisfies the presentational data type, no changes are needed
    return { data: collectionApiData, errors };
  } else {
    // TODO: introduce transformations for new data model API data
    return { data: null, errors };
  }
};
