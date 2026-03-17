import { TDataInFile } from "src/schemas/fileSchema";

import { TApiFamilyDocumentPublic, TFamilyDocumentPublic } from "@/types";

export const transformFamilyDocuments = (oldDocuments: TApiFamilyDocumentPublic[], newFiles: TDataInFile[]): TFamilyDocumentPublic[] =>
  oldDocuments.map((oldDocument) => {
    const newFile = newFiles.find((file) => file.value.id === oldDocument.import_id);
    if (!newFile) return oldDocument;

    return {
      ...oldDocument,
      import_id: newFile.value.id,
      slug: newFile.value.attributes.deprecated_slug,
      title: newFile.value.title,
    };
  });
