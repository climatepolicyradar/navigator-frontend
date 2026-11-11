import { getChildDocuments } from "@/bff/methods/getRelations";
import { transformCollection } from "@/bff/transformers/partials/transformCollection";
import { transformFamily } from "@/bff/transformers/partials/transformFamily";
import { TFamilyApiData, TFamilyPresentationalResponse } from "@/types";

export const familyTransformer = (familyApiData: TFamilyApiData, errors: Error[]): TFamilyPresentationalResponse => {
  try {
    return {
      data: {
        collections: familyApiData.collections.map((collection) =>
          transformCollection(
            collection,
            getChildDocuments(collection.documents)
              .map((relation) => relation.value)
              .filter((doc) => doc.labels.find((label) => label.type === "activity_status"))
          )
        ),
        family: transformFamily(familyApiData.family),
        familyTopics: familyApiData.familyTopics,
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
