import { transformOldCollections } from "@/bff/transformers/partials/transformOldCollections";
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
        collections: transformOldCollections(collections, corpusTypes),
        family: transformOldFamily(family, corpusTypes),
        debug: { newApiData: familyApiNewData, usesDataIn: false },
      },
      errors,
    };
  } catch (error) {
    return { data: null, errors: [...errors, error as Error] };
  }
};
