import { oldFamilyTransformer } from "@/bff/transformers/oldFamilyTransformer";
import { transformAttribution } from "@/bff/transformers/partials/transformAttribution";
import { transformConcepts } from "@/bff/transformers/partials/transformConcepts";
import { transformCountries } from "@/bff/transformers/partials/transformCountries";
import { transformFamilyCollections } from "@/bff/transformers/partials/transformFamilyCollections";
import { transformFamilyDocuments } from "@/bff/transformers/partials/transformFamilyDocuments";
import { transformFamilyEvents } from "@/bff/transformers/partials/transformFamilyEvents";
import { transformFamilyMetadata } from "@/bff/transformers/partials/transformFamilyMetadata";
import { transformOldCollection } from "@/bff/transformers/partials/transformOldCollection";
import { transformOldFamily } from "@/bff/transformers/partials/transformOldFamily";
import { ID_SEPARATOR } from "@/constants/chars";
import { LABEL_TYPES, MANDATORY_DOCUMENT_LABEL_TYPES, TDataInLabel, TDataInLabelType } from "@/schemas";
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
      const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(labels, LABEL_TYPES, MANDATORY_DOCUMENT_LABEL_TYPES);
      const attribution = transformAttribution(groupedLabels);
      const { familyEvents, documentEvents } = transformFamilyEvents(familyApiNewData, attribution.category);

      return {
        data: {
          ...oldData,
          collections: familyApiOldData.collections.map((collection) => transformOldCollection(collection, corpusTypes)),
          countries: transformCountries(familyApiOldData.countries, groupedLabels.geography),
          family: {
            attribution,
            collections: transformFamilyCollections(familyApiNewData),
            concepts: transformConcepts(groupedLabels.legal_concept),
            documents: transformFamilyDocuments(documents, documentEvents),
            events: familyEvents,
            geographies: groupedLabels.geography.map((label) => label.value.id.split(ID_SEPARATOR)[1]),
            import_id: familyApiNewData.id,
            last_updated_date: familyApiNewData.attributes.last_updated_date,
            metadata: transformFamilyMetadata(familyApiNewData.attributes, groupedLabels, attribution.category),
            published_date: familyApiNewData.attributes.published_date,
            slug: familyApiNewData.attributes.deprecated_slug,
            summary: familyApiNewData.description,
            title: familyApiNewData.title,
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
