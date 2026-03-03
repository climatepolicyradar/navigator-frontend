import { isOldFamilyApiData, TFamilyApiData, TFamilyPresentationalResponse } from "@/types";

export const familyTransformer = (familyApiData: TFamilyApiData, errors: Error[]): TFamilyPresentationalResponse => {
  if (familyApiData === null) return { data: null, errors };

  const isOldData = isOldFamilyApiData(familyApiData);

  if (isOldData) {
    // Because the old API data type satisfies the presentational data type, no changes are needed
    return { data: familyApiData, errors };
  } else {
    // TODO: introduce transformations for new data model API data
    return { data: null, errors };
  }
};
