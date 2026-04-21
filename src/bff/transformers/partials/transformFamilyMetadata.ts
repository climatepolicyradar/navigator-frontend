import { TDataInDocumentAttributes, TDataInLabel, TDataInLabelType } from "@/schemas";
import { API_FAMILY_METADATA_KEY, TApiFamilyMetadata, TApiFamilyMetadataKey, TAttributionCategory } from "@/types";
import { TItemsByType } from "@/utils/data-in/groupByType";

// For labels and attributes that are now named differently to their corresponding metadata key
const LABEL_TO_METADATA_MAP: Partial<Record<TDataInLabelType, TApiFamilyMetadataKey>> = {
  project_status: "status",
};
const ATTRIBUTE_TO_METADATA_MAP: Record<string, TApiFamilyMetadataKey> = {
  "identifier::project_id": "project_id",
  project_co_financing_usd: "project_value_co_financing",
  project_fund_spend_usd: "project_value_fund_spend",
};

const CONCEPT_PREFERRED_LABEL_TYPE_MAP: Record<string, string> = {
  case_category: "category",
};

const isFamilyMetadataKey = (string: string): string is TApiFamilyMetadataKey => API_FAMILY_METADATA_KEY.includes(string as TApiFamilyMetadataKey);

export const transformFamilyMetadata = (
  attributes: TDataInDocumentAttributes,
  groupedLabels: TItemsByType<TDataInLabel, TDataInLabelType>,
  category: TAttributionCategory
): TApiFamilyMetadata => {
  const familyMetadata: TApiFamilyMetadata = {};

  /* Attributes */

  Object.entries(attributes).forEach(([attributeKey, value]) => {
    if (value && isFamilyMetadataKey(attributeKey)) {
      familyMetadata[attributeKey] = [value.toString()];
    }
  });

  Object.entries(ATTRIBUTE_TO_METADATA_MAP).forEach(([attributeKey, metadataKey]) => {
    if (!(attributeKey in attributes)) return;
    const value = attributes[attributeKey as keyof TDataInDocumentAttributes];
    familyMetadata[metadataKey] = [value.toString()];
  });

  /* Labels */

  Object.entries(groupedLabels).forEach(([labelType, labels]) => {
    if (labels.length > 0 && isFamilyMetadataKey(labelType)) {
      familyMetadata[labelType] = labels.map((label) => label.value.value);
    }
  });

  Object.entries(LABEL_TO_METADATA_MAP).forEach(([labelType, metadataKey]) => {
    const labels = groupedLabels[labelType as TDataInLabelType];
    if (labels.length > 0) {
      familyMetadata[metadataKey] = labels.map((label) => label.value.value);
    }
  });

  if (category === "Litigation") {
    familyMetadata.concept_preferred_label = groupedLabels.legal_concept
      .map((concept) => {
        const type = CONCEPT_PREFERRED_LABEL_TYPE_MAP[concept.value.type] || concept.value.type;
        return [type, concept.value.value].join("/");
      })
      .sort();
  }

  return familyMetadata;
};
