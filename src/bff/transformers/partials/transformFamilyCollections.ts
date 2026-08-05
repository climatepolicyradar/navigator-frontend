import { getParentDocuments } from "@/bff/methods/getRelations";
import { transformCollection } from "@/bff/transformers/partials/transformCollection";
import { TDataInDocument } from "@/schemas";
import { TCollectionPublic } from "@/types";

export const transformFamilyCollections = (document: TDataInDocument): TCollectionPublic[] =>
  getParentDocuments(document.documents).map(({ value: collection }) => transformCollection(collection));
