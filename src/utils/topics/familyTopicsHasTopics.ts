import { IFamilyDocumentTopics } from "@/types";

export const familyTopicsHasTopics = (familyTopics: IFamilyDocumentTopics | null) =>
  Boolean(familyTopics && Object.keys(familyTopics.conceptCounts).length > 0);
