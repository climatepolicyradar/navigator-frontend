import { TFamilyApiNewData, TFamilyApiOldData, TFamilyPresentationalResponse } from "@/types";

export const familyTransformer = (
  familyApiOldData: TFamilyApiOldData,
  familyApiNewData: TFamilyApiNewData,
  errors: Error[]
): TFamilyPresentationalResponse => {
  if (familyApiOldData === null) return { data: null, errors };

  if (familyApiNewData) {
    // TODO: introduce transformations for new data model API data
    return { data: null, errors };
  } else {
    // Because the old API data type satisfies the presentational data type, no changes are needed
    return { data: familyApiOldData, errors };
  }
};
