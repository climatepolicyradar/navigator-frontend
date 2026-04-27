import { getChildDocuments } from "@/bff/methods/getRelations";
import { transformDocument } from "@/bff/transformers/partials/transformDocument";
import { TDocumentEvents } from "@/bff/transformers/partials/transformFamilyEvents";
import { TDataInDocumentRelation } from "@/schemas";
import { TFamilyDocumentPublic } from "@/types";

export const transformFamilyDocuments = (relations: TDataInDocumentRelation[], documentEvents: TDocumentEvents[]): TFamilyDocumentPublic[] =>
  getChildDocuments(relations)
    .map(({ value: document }) => {
      const events = documentEvents.find((doc) => doc.importId === document.id);
      return transformDocument(document, events ? events.events : []);
    })
    .filter((document) => document);
