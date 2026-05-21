import { getParentDocuments } from "@/bff/methods/getRelations";
import { transformCollection } from "@/bff/transformers/partials/transformCollection";
import { TCollectionPublic, TFamilyApiNewData } from "@/types";

export const transformFamilyCollections = (document: TFamilyApiNewData): TCollectionPublic[] =>
  getParentDocuments(document.documents).map(({ value: collection }) => transformCollection(collection));
