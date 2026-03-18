import { transformCountries } from "@/bff/transformers/partials/transformCountries";
import { transformFamilyDocuments } from "@/bff/transformers/partials/transformFamilyDocuments";
import { transformFamilyMetadata } from "@/bff/transformers/partials/transformFamilyMetadata";
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
    const groupedLabels = groupLabelsByType(labels);

    return {
      data: {
        ...familyApiOldData,
        countries: transformCountries(familyApiOldData.countries, groupedLabels.geography),
        family: {
          corpus_id: null, // unused
          documents: transformFamilyDocuments(familyApiOldData.family.documents, documents),
          geographies: groupedLabels.geography.map((label) => label.value.id),
          import_id: familyApiNewData.id,
          metadata: transformFamilyMetadata(groupedLabels),
          slug: familyApiNewData.attributes.deprecated_slug,
          summary: familyApiNewData.description,
          title: familyApiNewData.title,
          // TODO apply transformations to remaining fields:
          category: familyApiOldData.family.category,
          collections: familyApiOldData.family.collections,
          concepts: familyApiOldData.family.concepts, // currently out of scope
          events: familyApiOldData.family.events,
          last_updated_date: familyApiOldData.family.last_updated_date,
          organisation: familyApiOldData.family.organisation,
          published_date: familyApiOldData.family.published_date,
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
