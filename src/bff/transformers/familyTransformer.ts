import { TFamilyApiNewData, TFamilyApiOldData, TFamilyPresentationalResponse } from "@/types";

export const familyTransformer = (
  familyApiOldData: TFamilyApiOldData,
  familyApiNewData: TFamilyApiNewData,
  errors: Error[]
): TFamilyPresentationalResponse => {
  if (familyApiOldData === null) return { data: null, errors };

  if (familyApiNewData) {
    return {
      data: {
        ...familyApiOldData,
        family: {
          ...familyApiOldData.family,
          import_id: familyApiNewData.id,
          title: familyApiNewData.title,
          summary: familyApiNewData.description,
        },
      },
      errors,
    };
  } else {
    // Because the old API data type satisfies the presentational data type, no changes are needed
    return { data: familyApiOldData, errors };
  }
};
