import {
  ITEM_TYPES,
  LABEL_TYPES,
  MANDATORY_DOCUMENT_LABEL_TYPES,
  MANDATORY_ITEM_TYPES,
  TDataInDocument,
  TDataInItem,
  TDataInItemType,
  TDataInLabel,
  TDataInLabelType,
  validateDocumentAttributes,
} from "@/schemas";
import { TDocumentContentType, TFamilyDocumentPublic, TFamilyEventPublic } from "@/types";
import { groupByType } from "@/utils/data-in/groupByType";

export const transformDocument = (document: TDataInDocument, events: TFamilyEventPublic[]): TFamilyDocumentPublic => {
  const documentAttributes = validateDocumentAttributes(document.attributes);
  const ALLOWED_STATUSES = ["published", "awaiting_source_file"];
  const displayAllowed = ALLOWED_STATUSES.includes(documentAttributes.status);
  if (!displayAllowed) return null;

  const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(document.labels, LABEL_TYPES, MANDATORY_DOCUMENT_LABEL_TYPES);

  const itemsMandatory = documentAttributes.status === "awaiting_source_file" ? [] : MANDATORY_ITEM_TYPES;
  const groupedItems = groupByType<TDataInItem, TDataInItemType>(document.items ?? [], ITEM_TYPES, itemsMandatory);

  const languages = groupedLabels.language.map((label) => label.value.value);

  return {
    cdn_object: groupedItems.cdn[0]?.url || "",
    content_type: (groupedItems.cdn[0]?.content_type as TDocumentContentType) || null,
    document_role: groupedLabels.role[0]?.value.value.toUpperCase() || "",
    document_status: documentAttributes.status,
    document_type: groupedLabels.entity_type[0]?.value.value || null,
    events,
    import_id: document.id,
    language: languages[0] ?? "",
    languages,
    md5_sum: documentAttributes.md5_sum || null,
    slug: documentAttributes.deprecated_slug || null,
    source_url: groupedItems.source[0]?.url || "",
    title: document.title,
    variant_name: documentAttributes.variant || null,
    variant: documentAttributes.variant || null,
    // Not used:
    valid_metadata: {},
  };
};
