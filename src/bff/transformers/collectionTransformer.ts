import { oldCollectionTransformer } from "@/bff/transformers/oldCollectionTransformer";
import { transformCollection } from "@/bff/transformers/partials/transformCollection";
import { TCollectionApiNewData, TCollectionApiOldData, TCollectionPresentationalResponse } from "@/types";

export const collectionTransformer = (
  collectionApiOldData: TCollectionApiOldData,
  collectionApiNewData: TCollectionApiNewData,
  errors: Error[]
): TCollectionPresentationalResponse => {
  if (collectionApiOldData === null) return { data: null, errors };

  if (collectionApiNewData.collection && collectionApiNewData.families) {
    try {
      return {
        data: {
          collection: transformCollection(collectionApiNewData.collection, collectionApiNewData.families),
          debug: {
            usesDataIn: true,
            newApiData: collectionApiNewData,
            originalCollection: collectionApiOldData.collection,
          },
        },
        errors,
      };
    } catch (error) {
      return oldCollectionTransformer(collectionApiOldData, collectionApiNewData, [...errors, error as Error]);
    }
  } else {
    return oldCollectionTransformer(collectionApiOldData, collectionApiNewData, errors);
  }
};
