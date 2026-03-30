import {
  FILE_ITEM_TYPES,
  LABEL_TYPES,
  MANDATORY_FILE_ITEM_TYPES,
  TDataInFile,
  TDataInFileItem,
  TDataInFileItemType,
  TDataInLabel,
  TDataInLabelType,
} from "@/schemas";
import { TApiFamilyDocumentPublic, TDocumentContentType, TFamilyDocumentPublic } from "@/types";
import { groupByType } from "@/utils/data-in/groupByType";

export const transformFamilyDocuments = (oldDocuments: TApiFamilyDocumentPublic[], newFiles: TDataInFile[]): TFamilyDocumentPublic[] =>
  newFiles.map((file) => {
    const oldDocument = oldDocuments.find((document) => file.value.id === document.import_id);
    if (!oldDocument) throw new Error(`File '${file.value.id}' does not match any V2 API document`);

    const groupedLabels = groupByType<TDataInLabel, TDataInLabelType>(file.value.labels, LABEL_TYPES, []);
    const groupedItems = groupByType<TDataInFileItem, TDataInFileItemType>(file.value.items, FILE_ITEM_TYPES, MANDATORY_FILE_ITEM_TYPES);

    return {
      cdn_object: groupedItems.cdn[0].url,
      content_type: groupedItems.cdn[0].content_type as TDocumentContentType,
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
      // TODO apply transformations to remaining fields:
      document_role: oldDocument.document_role,
      document_type: oldDocument.document_type,
      document_status: oldDocument.document_status,
      events: oldDocument.events,
    };
  });
