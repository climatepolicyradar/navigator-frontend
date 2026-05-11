import { transformCollection } from "@/bff/transformers/partials/transformCollection";
import { transformFamily } from "@/bff/transformers/partials/transformFamily";
import { TFamilyApiData, TFamilyPresentationalResponse } from "@/types";

export const familyTransformer = (familyApiData: TFamilyApiData, errors: Error[]): TFamilyPresentationalResponse => {
  try {
    return {
      data: {
        collections: familyApiData.collections.map((collection) => transformCollection(collection)),
        family: transformFamily(familyApiData.family),
        familyTopics: familyApiData.familyTopics,
        subdivisions: [], // TODO
        targets: familyApiData.targets,
        vespaFamilyData: familyApiData.vespaFamilyData,
        debug: {
          dataInDocument: familyApiData.family,
        },
      },
      errors,
    };
  } catch (error) {
    return { data: null, errors: [...errors, error as Error] };
  }
};
