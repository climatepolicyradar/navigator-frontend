import { TFamilyApiNewData, TFamilyApiOldData, TFamilyPresentationalResponse } from "@/types";

export const familyTransformer = (
  familyApiOldData: TFamilyApiOldData,
  familyApiNewData: TFamilyApiNewData,
  errors: Error[]
): TFamilyPresentationalResponse => {
  if (familyApiOldData === null) return { data: null, errors };

  if (familyApiNewData) {
    const geographyLabels = familyApiNewData.labels.filter((label) => label.type === "geography");

    return {
      data: {
        ...familyApiOldData,
        countries: geographyLabels
          .map((label) => {
            // TODO stop using old data when country/subdivision diff + slug are provided by new api
            const oldCountry = familyApiOldData.countries.find((country) => country.value === label.value.id);
            if (!oldCountry) return null;

            return {
              ...oldCountry,
              display_value: label.value.value,
              value: label.value.id,
            };
          })
          .filter((label) => label),
        family: {
          ...familyApiOldData.family,
          import_id: familyApiNewData.id,
          title: familyApiNewData.title,
          summary: familyApiNewData.description,
          geographies: geographyLabels.map((label) => label.value.id),
        },
        usesDataIn: true,
      },
      errors,
    };
  } else {
    // Because the old API data type satisfies the presentational data type, no changes are needed
    return { data: { ...familyApiOldData, usesDataIn: false }, errors };
  }
};
