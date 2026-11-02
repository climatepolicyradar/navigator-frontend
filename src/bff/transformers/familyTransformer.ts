import { transformCollection } from "@/bff/transformers/partials/transformCollection";
import { transformFamily } from "@/bff/transformers/partials/transformFamily";
import { TFamilyApiData, TFamilyPresentationalResponse, TOnDirectLinkPolicy } from "@/types";

export const familyTransformer = (
  familyApiData: TFamilyApiData,
  directLinkPolicy: TOnDirectLinkPolicy | null,
  errors: Error[]
): TFamilyPresentationalResponse => {
  try {
    return {
      data: {
        collections: familyApiData.collections.map((collection) => transformCollection(collection)),
        family: transformFamily(familyApiData.family),
        familyTopics: familyApiData.familyTopics,
        directLinkPolicy,
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
