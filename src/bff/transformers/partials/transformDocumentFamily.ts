import { getParentDocuments } from "@/bff/methods/getRelations";
import { transformFamily } from "@/bff/transformers/partials/transformFamily";
import { TDataInDocumentRelation } from "@/schemas";
import { TFamilyPublic } from "@/types";

export const transformDocumentFamily = (relations: TDataInDocumentRelation[]): TFamilyPublic => {
  const families = getParentDocuments(relations);
  return families.length === 0 ? null : transformFamily(families[0].value);
};
