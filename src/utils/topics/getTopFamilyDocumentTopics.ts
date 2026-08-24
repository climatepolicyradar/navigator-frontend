import { IFamilyDocumentTopics, TTopic } from "@/types";

// The document-level `conceptCounts` are keyed `<wikibase id>:<label>`, unlike the family-wide
// counts which are keyed by bare wikibase id, so keys are split before lookup. `conceptsGrouped`
// holds the resolved topic records; restricting it to the ids this document mentions and ranking
// by count gives the topics most worth offering as a starting point for a search within it.
export const getTopFamilyDocumentTopics = (
  familyTopics: IFamilyDocumentTopics | null | undefined,
  documentImportId: string,
  limit?: number
): TTopic[] => {
  const document = familyTopics?.documents.find((doc) => doc.importId === documentImportId);
  if (!document) return [];

  const counts: Record<string, number> = {};
  Object.entries(document.conceptCounts).forEach(([conceptKey, count]) => {
    const wikibaseId = conceptKey.split(":")[0];
    if (wikibaseId) counts[wikibaseId] = (counts[wikibaseId] ?? 0) + count;
  });

  return Object.values(familyTopics.conceptsGrouped)
    .flat()
    .filter((topic) => counts[topic.wikibase_id] !== undefined)
    .map((topic) => ({ ...topic, count: counts[topic.wikibase_id] }))
    .sort((topicA, topicB) => topicB.count - topicA.count)
    .slice(0, limit);
};
