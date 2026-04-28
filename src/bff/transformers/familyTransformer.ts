import { oldFamilyTransformer } from "@/bff/transformers/oldFamilyTransformer";
import { transformCountries } from "@/bff/transformers/partials/transformCountries";
import { transformFamily } from "@/bff/transformers/partials/transformFamily";
import { transformOldCollection } from "@/bff/transformers/partials/transformOldCollection";
import { transformOldFamily } from "@/bff/transformers/partials/transformOldFamily";
import { LABEL_TYPES, MANDATORY_FAMILY_LABEL_TYPES, TDataInLabel, TDataInLabelType } from "@/schemas";
import { TFamilyApiNewData, TFamilyApiOldData, TFamilyPresentationalResponse } from "@/types";
import { groupByType } from "@/utils/data-in/groupByType";

export const familyTransformer = (
  familyApiOldData: TFamilyApiOldData,
  familyApiNewData: TFamilyApiNewData,
  errors: Error[]
): TFamilyPresentationalResponse => {
  if (familyApiOldData === null) return { data: null, errors };

  if (familyApiNewData) {
    try {
      const { corpusTypes, ...oldData } = familyApiOldData;
      const { labels } = familyApiNewData;
      const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(labels, LABEL_TYPES, MANDATORY_FAMILY_LABEL_TYPES);
      const family = transformFamily(familyApiNewData);

      return {
        data: {
          ...oldData,
          collections: familyApiOldData.collections.map((collection) => transformOldCollection(collection, corpusTypes)),
          countries: transformCountries(familyApiOldData.countries, groupedLabels.geography),
          family,
          debug: {
            originalFamily: transformOldFamily(familyApiOldData.family, corpusTypes),
            newApiData: familyApiNewData,
            usesDataIn: true,
          },
        },
        errors,
      };
    } catch (error) {
      return oldFamilyTransformer(familyApiOldData, familyApiNewData, [...errors, error as Error]);
    }
  } else {
    return oldFamilyTransformer(familyApiOldData, familyApiNewData, errors);
  }
};
