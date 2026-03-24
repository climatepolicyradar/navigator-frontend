import { transformCountries } from "@/bff/transformers/partials/transformCountries";
import { transformFamilyDocuments } from "@/bff/transformers/partials/transformFamilyDocuments";
import { transformFamilyMetadata } from "@/bff/transformers/partials/transformFamilyMetadata";
import { TCategory, TFamilyApiNewData, TFamilyApiOldData, TFamilyPresentationalResponse } from "@/types";
import { groupLabelsByType } from "@/utils/labels/groupLabelsByType";

export const familyTransformer = (
  familyApiOldData: TFamilyApiOldData,
  familyApiNewData: TFamilyApiNewData,
  errors: Error[]
): TFamilyPresentationalResponse => {
  if (familyApiOldData === null) return { data: null, errors };

  if (familyApiNewData) {
    try {
      const { documents, labels } = familyApiNewData;
      const groupedLabels = groupLabelsByType(labels);

      return {
        data: {
          ...familyApiOldData,
          countries: transformCountries(familyApiOldData.countries, groupedLabels.geography),
          family: {
            category: groupedLabels.category[0].value.value as TCategory,
            corpus_id: familyApiOldData.family.corpus_id, // unused except for debugging
            documents: transformFamilyDocuments(familyApiOldData.family.documents, documents),
            geographies: groupedLabels.geography.map((label) => label.value.id),
            import_id: familyApiNewData.id,
            last_updated_date: familyApiNewData.attributes.last_updated_date,
            metadata: transformFamilyMetadata(groupedLabels),
            organisation: groupedLabels.organisation[0].value.value,
            published_date: familyApiNewData.attributes.published_date,
            slug: familyApiNewData.attributes.deprecated_slug,
            summary: familyApiNewData.description,
            title: familyApiNewData.title,
            // TODO apply transformations to remaining fields:
            collections: familyApiOldData.family.collections,
            concepts: familyApiOldData.family.concepts, // currently out of scope
            events: familyApiOldData.family.events,
          },
          debug: {
            originalFamily: familyApiOldData.family,
            newApiData: familyApiNewData,
            usesDataIn: true,
          },
        },
        errors,
      };
    } catch (error) {
      return {
        data: {
          ...familyApiOldData,
          debug: { newApiData: familyApiNewData, usesDataIn: false },
        },
        errors: [...errors, error as Error],
      };
    }
  } else {
    // Because the old API data type satisfies the presentational data type, no changes are needed
    return {
      data: {
        ...familyApiOldData,
        debug: { newApiData: familyApiNewData, usesDataIn: false },
      },
      errors,
    };
  }
};
