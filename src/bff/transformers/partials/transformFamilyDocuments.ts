import { TDocumentEvents } from "@/bff/transformers/partials/transformFamilyEvents";
import {
  FILE_ITEM_TYPES,
  LABEL_TYPES,
  MANDATORY_FILE_LABEL_TYPES,
  MANDATORY_FILE_ITEM_TYPES,
  TDataInFile,
  TDataInFileItem,
  TDataInFileItemType,
  TDataInLabel,
  TDataInLabelType,
} from "@/schemas";
import { TDocumentContentType, TFamilyDocumentPublic } from "@/types";
import { groupByType } from "@/utils/data-in/groupByType";

export const transformFamilyDocuments = (files: TDataInFile[], documentEvents: TDocumentEvents[]): TFamilyDocumentPublic[] =>
  files
    .filter((file) => file.type === "has_member" && file.value.attributes.status === "published")
    .map((file) => {
      const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(file.value.labels, LABEL_TYPES, MANDATORY_FILE_LABEL_TYPES);
      const groupedItems = groupByType<TDataInFileItem, TDataInFileItemType>(file.value.items, FILE_ITEM_TYPES, MANDATORY_FILE_ITEM_TYPES);
      const events = documentEvents.find((doc) => doc.importId === file.value.id);

      return {
        cdn_object: groupedItems.cdn[0].url,
        content_type: groupedItems.cdn[0].content_type as TDocumentContentType,
        document_role: groupedLabels.role[0]?.value.value.toUpperCase() || null,
        document_status: file.value.attributes.status,
        document_type: groupedLabels.entity_type[0]?.value.value || null,
        events: events ? events.events : [],
        import_id: file.value.id,
        languages: groupedLabels.language.map((label) => label.value.value),
        md5_sum: file.value.attributes.md5_sum || null,
        slug: file.value.attributes.deprecated_slug,
        source_url: groupedItems.source[0].url,
        title: file.value.title,
        variant_name: file.value.attributes.variant || null,
        variant: file.value.attributes.variant || null,
        // Not used:
        language: "",
        valid_metadata: {},
      };
    });
