import { transformCollection } from "@/bff/transformers/partials/transformCollection";
import { TCollectionApiData, TCollectionPresentationalResponse } from "@/types";

export const collectionTransformer = (collectionApiData: TCollectionApiData, errors: Error[]): TCollectionPresentationalResponse => {
  try {
    const { collection, families } = collectionApiData;

    return {
      data: {
        collection: transformCollection(collection, families),
        debug: {
          dataInDocument: collection,
        },
      },
      errors,
    };
  } catch (error) {
    return { data: null, errors: [...errors, error as Error] };
  }
};
