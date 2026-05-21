import { TDataInDocumentRelation, TDataInDocumentRelationType } from "@/schemas";

const getRelations = (relations: TDataInDocumentRelation[], relationTypes: TDataInDocumentRelationType[]) =>
  relations.filter((relation) => relationTypes.includes(relation.type));

export const getChildDocuments = (relations: TDataInDocumentRelation[] = []) => {
  const childRelationTypes: TDataInDocumentRelationType[] = ["has_member", "has_version"];
  return getRelations(relations, childRelationTypes);
};

export const getParentDocuments = (relations: TDataInDocumentRelation[] = []) => {
  const parentRelationTypes: TDataInDocumentRelationType[] = ["member_of", "is_version_of"];
  return getRelations(relations, parentRelationTypes);
};
