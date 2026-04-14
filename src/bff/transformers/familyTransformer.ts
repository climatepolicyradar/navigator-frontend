import { oldFamilyTransformer } from "@/bff/transformers/oldFamilyTransformer";
import { transformAttribution } from "@/bff/transformers/partials/transformAttribution";
import { transformCountries } from "@/bff/transformers/partials/transformCountries";
import { transformFamilyCollections } from "@/bff/transformers/partials/transformFamilyCollections";
import { transformFamilyDocuments } from "@/bff/transformers/partials/transformFamilyDocuments";
import { transformFamilyEvents } from "@/bff/transformers/partials/transformFamilyEvents";
import { transformFamilyMetadata } from "@/bff/transformers/partials/transformFamilyMetadata";
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
      const { documents, labels } = familyApiNewData;
      const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(labels, LABEL_TYPES, MANDATORY_FAMILY_LABEL_TYPES);

      return {
        data: {
          ...oldData,
          collections: familyApiOldData.collections.map((collection) => transformOldCollection(collection, corpusTypes)),
          countries: transformCountries(familyApiOldData.countries, groupedLabels.geography),
          family: {
            attribution: transformAttribution(groupedLabels),
            collections: transformFamilyCollections(familyApiOldData.family.collections, familyApiNewData.documents),
            documents: transformFamilyDocuments(familyApiOldData.family.documents, documents),
            events: transformFamilyEvents(groupedLabels),
            geographies: groupedLabels.geography.map((label) => label.value.id),
            import_id: familyApiNewData.id,
            last_updated_date: familyApiNewData.attributes.last_updated_date,
            metadata: transformFamilyMetadata(familyApiNewData.attributes, groupedLabels),
            published_date: familyApiNewData.attributes.published_date,
            slug: familyApiNewData.attributes.deprecated_slug,
            summary: familyApiNewData.description,
            title: familyApiNewData.title,
            // TODO apply transformations to remaining fields:
            concepts: familyApiOldData.family.concepts,
          },
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
