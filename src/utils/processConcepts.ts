import { ORDERED_ROOT_TOPIC_IDS, ROOT_TOPICS } from "@/constants/topics";
import { TConcept } from "@/types";

import { sortTopics } from "./sorting";

// TODO: move this fetching to a Next API route
const fetchConcept = async (conceptId: string): Promise<TConcept> => {
  return fetch(`https://cdn.climatepolicyradar.org/concepts/${conceptId}.json`).then((response) => response.json());
};

// TODO: make this a react query hook with caching per conceptId
export const fetchAndProcessConcepts = async (conceptIds: string[]) => {
  const rootConceptsS3Promises = ORDERED_ROOT_TOPIC_IDS.map(async (conceptId) => {
    try {
      return await fetchConcept(conceptId);
    } catch {
      return {
        wikibase_id: conceptId,
        preferred_label: ROOT_TOPICS[conceptId] || "Other",
        description: "Topic data unavailable",
        subconcept_of: [],
      } as TConcept;
    }
  });

  const conceptsS3Promises = conceptIds.map((conceptId) => fetchConcept(conceptId));
  const allConcepts = await Promise.allSettled([...rootConceptsS3Promises, ...conceptsS3Promises]);
  const filteredConcepts = allConcepts.filter(Boolean);
  /** We currently fail silently for some concepts, but we will see errors in the network panel */
  const rootConceptsResults = sortTopics(
    filteredConcepts
      .slice(0, rootConceptsS3Promises.length)
      .filter((promiseSettledResult): promiseSettledResult is PromiseFulfilledResult<TConcept> => promiseSettledResult.status === "fulfilled")
      .map((promiseSettledResult) => promiseSettledResult.value)
  );

  const conceptsResults = filteredConcepts
    .slice(rootConceptsS3Promises.length)
    .filter((promiseSettledResult): promiseSettledResult is PromiseFulfilledResult<TConcept> => promiseSettledResult.status === "fulfilled")
    .map((promiseSettledResult) => promiseSettledResult.value);

  return { rootConcepts: rootConceptsResults, concepts: conceptsResults };
};
