import { transformCountries } from "@/bff/transformers/partials/transformCountries";
import { transformFamilyDocuments } from "@/bff/transformers/partials/transformFamilyDocuments";
import { TFamilyApiNewData, TFamilyApiOldData, TFamilyPresentationalResponse } from "@/types";
import { groupLabelsByType } from "@/utils/labels/groupLabelsByType";

export const familyTransformer = (
  familyApiOldData: TFamilyApiOldData,
  familyApiNewData: TFamilyApiNewData,
  errors: Error[]
): TFamilyPresentationalResponse => {
  if (familyApiOldData === null) return { data: null, errors };

  if (familyApiNewData) {
    const { documents, labels } = familyApiNewData;
    const { geography: geographyLabels } = groupLabelsByType(labels);

    return {
      data: {
        ...familyApiOldData,
        countries: transformCountries(familyApiOldData.countries, geographyLabels),
        family: {
          ...familyApiOldData.family,
          import_id: familyApiNewData.id,
          slug: familyApiNewData.attributes.deprecated_slug,
          title: familyApiNewData.title,
          summary: familyApiNewData.description,
          documents: transformFamilyDocuments(familyApiOldData.family.documents, documents),
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
