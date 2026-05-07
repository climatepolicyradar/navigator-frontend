import { transformAttribution } from "@/bff/transformers/partials/transformAttribution";
import { transformConcepts } from "@/bff/transformers/partials/transformConcepts";
import { transformFamilyCollections } from "@/bff/transformers/partials/transformFamilyCollections";
import { transformFamilyDocuments } from "@/bff/transformers/partials/transformFamilyDocuments";
import { transformFamilyEvents } from "@/bff/transformers/partials/transformFamilyEvents";
import { transformFamilyMetadata } from "@/bff/transformers/partials/transformFamilyMetadata";
import { ID_SEPARATOR } from "@/constants/chars";
import { LABEL_TYPES, MANDATORY_FAMILY_LABEL_TYPES, TDataInDocument, TDataInLabel, TDataInLabelType, validateFamilyAttributes } from "@/schemas";
import { TFamilyPublic } from "@/types";
import { groupByType } from "@/utils/data-in/groupByType";

export const transformFamily = (document: TDataInDocument): TFamilyPublic => {
  const familyAttributes = validateFamilyAttributes(document.attributes);

  const { documents, labels } = document;
  const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(labels, LABEL_TYPES, MANDATORY_FAMILY_LABEL_TYPES);
  const attribution = transformAttribution(groupedLabels);
  const { familyEvents, documentEvents } = transformFamilyEvents(document, attribution.category);

  return {
    attribution,
    collections: transformFamilyCollections(document, attribution.category),
    concepts: transformConcepts(groupedLabels.legal_concept),
    documents: transformFamilyDocuments(documents, documentEvents, attribution.category),
    events: familyEvents,
    geographies: groupedLabels.geography.map((label) => label.value.id.split(ID_SEPARATOR)[1]),
    import_id: document.id,
    last_updated_date: familyAttributes.last_updated_date ?? null,
    metadata: transformFamilyMetadata(familyAttributes, groupedLabels, attribution.category),
    published_date: familyAttributes.published_date,
    slug: familyAttributes.deprecated_slug,
    summary: document.description,
    title: document.title,
  };
};
