import { getChildDocuments } from "@/bff/methods/getRelations";
import { transformDocument } from "@/bff/transformers/partials/transformDocument";
import { TDocumentEvents } from "@/bff/transformers/partials/transformFamilyEvents";
import { TDataInDocumentRelation } from "@/schemas";
import { TAttributionCategory, TFamilyDocumentPublic } from "@/types";

export const transformFamilyDocuments = (
  relations: TDataInDocumentRelation[],
  documentEvents: TDocumentEvents[],
  category: TAttributionCategory
): TFamilyDocumentPublic[] =>
  getChildDocuments(relations, category)
    .map(({ value: document }) => {
      const events = documentEvents.find((doc) => doc.importId === document.id);
      return transformDocument(document, events ? events.events : []);
    })
    .filter((document) => document);
