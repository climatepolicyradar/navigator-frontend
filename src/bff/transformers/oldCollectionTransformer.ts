import { transformOldCollection } from "@/bff/transformers/partials/transformOldCollection";
import { TCollectionApiNewData, TCollectionApiOldData, TCollectionPresentationalResponse } from "@/types";

export const oldCollectionTransformer = (
  collectionApiOldData: TCollectionApiOldData,
  collectionApiNewData: TCollectionApiNewData,
  errors: Error[]
): TCollectionPresentationalResponse => {
  try {
    return {
      data: {
        ...collectionApiOldData,
        collection: transformOldCollection(collectionApiOldData.collection, {}),
        debug: {
          newApiData: collectionApiNewData,
          usesDataIn: false,
        },
      },
      errors,
    };
  } catch (error) {
    return { data: null, errors: [...errors, error as Error] };
  }
};
