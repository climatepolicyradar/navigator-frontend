import { TDataInMedia } from "src/schemas/mediaSchema";

import { TApiFamilyDocumentPublic, TFamilyDocumentPublic } from "@/types";

export const transformFamilyDocuments = (oldDocuments: TApiFamilyDocumentPublic[], newDocuments: TDataInMedia[]): TFamilyDocumentPublic[] =>
  oldDocuments.map((oldDocument) => {
    const newDocument = newDocuments.find((doc) => doc.value.id === oldDocument.import_id);
    if (!newDocument) return oldDocument;

    return {
      ...oldDocument,
      import_id: newDocument.value.id,
      title: newDocument.value.title,
    };
  });
