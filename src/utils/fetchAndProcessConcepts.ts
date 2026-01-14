import { ORDERED_ROOT_TOPIC_IDS, ROOT_TOPICS } from "@/constants/topics";
import { TConcept } from "@/types";
import { sortRootTopics } from "@/utils/sorting";

const fetchConcept = async (conceptId: string): Promise<TConcept> => {
  return fetch(`https://cdn.climatepolicyradar.org/concepts/${conceptId}.json`).then((response) => response.json());
};

export const fetchAndProcessConcepts = async (conceptIds: string[]): Promise<{ rootConcepts: TConcept[]; concepts: TConcept[] }> => {
  /* Concept fetching */

  const rootConceptPromises = ORDERED_ROOT_TOPIC_IDS.map(async (conceptId) => {
    try {
      return await fetchConcept(conceptId);
    } catch {
      const unavailableConcept: TConcept = {
        alternative_labels: [],
        description: "Topic data unavailable",
        has_subconcept: [],
        negative_labels: [],
        preferred_label: ROOT_TOPICS[conceptId] || "Other",
        recursive_subconcept_of: [],
        related_concepts: [],
        subconcept_of: [],
        wikibase_id: conceptId,
      };
      return unavailableConcept;
    }
  });

  const conceptPromises = conceptIds.map((conceptId) => fetchConcept(conceptId));
  const conceptResults = await Promise.allSettled([...rootConceptPromises, ...conceptPromises]);
  const allConcepts = conceptResults.filter(Boolean);

  /* Concept processing */

  const rootConcepts = sortRootTopics(
    allConcepts
      .slice(0, rootConceptPromises.length)
      .filter((promiseSettledResult): promiseSettledResult is PromiseFulfilledResult<TConcept> => promiseSettledResult.status === "fulfilled")
      .map((promiseSettledResult) => promiseSettledResult.value)
  );

  const concepts = allConcepts
    .slice(rootConceptPromises.length)
    .filter((promiseSettledResult): promiseSettledResult is PromiseFulfilledResult<TConcept> => promiseSettledResult.status === "fulfilled")
    .map((promiseSettledResult) => promiseSettledResult.value);

  return { rootConcepts, concepts };
};
