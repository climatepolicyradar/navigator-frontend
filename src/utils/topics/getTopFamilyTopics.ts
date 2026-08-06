import { IFamilyDocumentTopics, TTopic } from "@/types";

// `conceptsGrouped` holds the resolved topic records grouped by root concept, and
// `conceptCounts` holds the family-wide mention count for each. Flattening the groups and
// ranking by count gives the topics most worth offering as a starting point for a search.
export const getTopFamilyTopics = (familyTopics: IFamilyDocumentTopics | null, limit: number): TTopic[] => {
  if (!familyTopics) return [];

  return Object.values(familyTopics.conceptsGrouped)
    .flat()
    .map((topic) => ({ ...topic, count: familyTopics.conceptCounts[topic.wikibase_id] ?? 0 }))
    .sort((topicA, topicB) => topicB.count - topicA.count)
    .slice(0, limit);
};
