import { transformOldCollection } from "@/bff/transformers/partials/transformOldCollection";
import { transformOldFamily } from "@/bff/transformers/partials/transformOldFamily";
import { TFamilyApiNewData, TFamilyApiOldData, TFamilyPresentationalResponse } from "@/types";

export const oldFamilyTransformer = (
  familyApiOldData: TFamilyApiOldData,
  familyApiNewData: TFamilyApiNewData,
  errors: Error[]
): TFamilyPresentationalResponse => {
  const { collections, corpusTypes, family } = familyApiOldData;

  try {
    return {
      data: {
        ...familyApiOldData,
        collections: collections.map((collection) => transformOldCollection(collection, corpusTypes)),
        family: transformOldFamily(family, corpusTypes),
        debug: { newApiData: familyApiNewData, usesDataIn: false },
      },
      errors,
    };
  } catch (error) {
    return { data: null, errors: [...errors, error as Error] };
  }
};
