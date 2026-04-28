import { TDataInDocumentRelation, TDataInDocumentRelationType } from "@/schemas";
import { TAttributionCategory } from "@/types";

const getRelations = (relations: TDataInDocumentRelation[], relationTypes: TDataInDocumentRelationType[]) =>
  relations.filter((relation) => relationTypes.includes(relation.type));

export const getChildDocuments = (relations: TDataInDocumentRelation[] = [], category: TAttributionCategory) => {
  const childRelationTypes: TDataInDocumentRelationType[] =
    category === "Litigation" ? ["has_member", "is_version_of"] : ["has_member", "has_version"];
  return getRelations(relations, childRelationTypes);
};

export const getParentDocuments = (relations: TDataInDocumentRelation[] = [], category: TAttributionCategory) => {
  const parentRelationTypes: TDataInDocumentRelationType[] =
    category === "Litigation" ? ["has_version", "member_of"] : ["is_version_of", "member_of"];
  return getRelations(relations, parentRelationTypes);
};
