import { TConcept } from "@/types";

export interface IFamilyDocumentTopics {
  documents: {
    importId: string;
    title: string;
    slug: string;
    conceptCounts: Record<string, number>;
  }[];
  conceptCounts: Record<string, number>;
  rootConcepts: TConcept[];
  conceptsGrouped: {
    [rootConceptId: string]: TConcept[];
  };
}
