import { TDataInDocumentRelation } from "@/schemas";

export const getChildDocuments = (relations: TDataInDocumentRelation[]) => relations.filter((relation) => relation.type === "has_member");

export const getParentDocuments = (relations: TDataInDocumentRelation[]) => relations.filter((relation) => relation.type === "member_of");
