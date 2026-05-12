import { getParentDocuments } from "@/bff/methods/getRelations";
import { transformCollection } from "@/bff/transformers/partials/transformCollection";
import { TDataInDocument } from "@/schemas";
import { TAttributionCategory, TCollectionPublic } from "@/types";

export const transformFamilyCollections = (document: TDataInDocument, category: TAttributionCategory): TCollectionPublic[] =>
  getParentDocuments(document.documents, category).map(({ value: collection }) => transformCollection(collection));
