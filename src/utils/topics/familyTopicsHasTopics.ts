import { IFamilyDocumentTopics } from "@/types";

export const familyTopicsHasTopics = (familyTopics: IFamilyDocumentTopics | null) => Boolean(familyTopics && familyTopics.topics.length > 0);
