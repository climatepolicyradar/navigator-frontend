import { oldCollectionTransformer } from "@/bff/transformers/oldCollectionTransformer";
import { TCollectionApiNewData, TCollectionApiOldData, TCollectionPresentationalResponse } from "@/types";

export const collectionTransformer = (
  collectionApiOldData: TCollectionApiOldData,
  collectionApiNewData: TCollectionApiNewData,
  errors: Error[]
): TCollectionPresentationalResponse => {
  if (collectionApiOldData === null) return { data: null, errors };

  if (collectionApiNewData) {
    // TODO: introduce transformations for new data model API data
    return { data: null, errors };
  } else {
    // Because the old API data type satisfies the presentational data type, no changes are needed
    return oldCollectionTransformer(collectionApiOldData, collectionApiNewData, errors);
  }
};
