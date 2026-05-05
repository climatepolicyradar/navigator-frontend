import { getParentDocuments } from "@/bff/methods/getRelations";
import { transformFamily } from "@/bff/transformers/partials/transformFamily";
import { TDataInDocumentRelation } from "@/schemas";
import { TAttributionCategory, TFamilyPublic } from "@/types";

export const transformDocumentFamily = (relations: TDataInDocumentRelation[], category: TAttributionCategory): TFamilyPublic => {
  const families = getParentDocuments(relations, category);
  return families.length === 0 ? null : transformFamily(families[0].value);
};
