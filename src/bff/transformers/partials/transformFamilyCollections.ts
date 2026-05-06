import { getParentDocuments } from "@/bff/methods/getRelations";
import { transformCollection } from "@/bff/transformers/partials/transformCollection";
import { TAttributionCategory, TCollectionPublic, TFamilyApiNewData } from "@/types";

export const transformFamilyCollections = (document: TFamilyApiNewData, category: TAttributionCategory): TCollectionPublic[] =>
  getParentDocuments(document.documents, category).map(({ value: collection }) => transformCollection(collection));
