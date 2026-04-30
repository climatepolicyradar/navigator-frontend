import { oldCollectionTransformer } from "@/bff/transformers/oldCollectionTransformer";
import { TCollectionApiNewData, TCollectionApiOldData, TCollectionPresentationalResponse } from "@/types";

import { transformOldCollection } from "./partials/transformOldCollection";

export const collectionTransformer = (
  collectionApiOldData: TCollectionApiOldData,
  collectionApiNewData: TCollectionApiNewData,
  errors: Error[]
): TCollectionPresentationalResponse => {
  if (collectionApiOldData === null) return { data: null, errors };

  if (collectionApiNewData) {
    try {
      return {
        data: {
          ...collectionApiOldData,
          collection: transformOldCollection(collectionApiOldData.collection, {}),
          debug: {
            usesDataIn: false, // TODO
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
