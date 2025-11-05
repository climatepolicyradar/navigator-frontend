import { TConcept } from "@/types";

// Define the root level concepts
export const ROOT_LEVEL_CONCEPTS = {
  Q1651: "Targets",
  Q709: "Sectors",
  Q975: "Climate risk",
  Q638: "Fossil fuel",
  Q672: "Impacted groups",
  Q1343: "Climate finance",
  Q1171: "Instruments",
  Q218: "Greenhouse gases",
  Q1367: "Public finance actors",
  Q47: "Just transition",
  Q567: "Renewable energy",
};
export const rootLevelConceptsIds = Object.keys(ROOT_LEVEL_CONCEPTS);

// TODO: move this fetching to a Next API route
const fetchConcept = async (conceptId: string): Promise<TConcept> => {
  return fetch(`https://cdn.climatepolicyradar.org/concepts/${conceptId}.json`).then((response) => response.json());
};

// TODO: make this a react query hook with caching per conceptId
export const fetchAndProcessConcepts = async (conceptIds: string[]) => {
  const rootConceptsS3Promises = rootLevelConceptsIds.map(async (conceptId) => {
    try {
      return await fetchConcept(conceptId);
    } catch {
      return {
        wikibase_id: conceptId,
        preferred_label: ROOT_LEVEL_CONCEPTS[conceptId] || "Other",
        description: "Topic data unavailable",
        subconcept_of: [],
      } as TConcept;
    }
  });

  const conceptsS3Promises = conceptIds.map((conceptId) => fetchConcept(conceptId));
  const allConcepts = await Promise.allSettled([...rootConceptsS3Promises, ...conceptsS3Promises]);
  const filteredConcepts = allConcepts.filter(Boolean);
  /** We currently fail silently for some concepts, but we will see errors in the network panel */
  const rootConceptsResults = filteredConcepts
    .slice(0, rootConceptsS3Promises.length)
    .filter((promiseSettledResult): promiseSettledResult is PromiseFulfilledResult<TConcept> => promiseSettledResult.status === "fulfilled")
    .map((promiseSettledResult) => promiseSettledResult.value);

  const conceptsResults = filteredConcepts
    .slice(rootConceptsS3Promises.length)
    .filter((promiseSettledResult): promiseSettledResult is PromiseFulfilledResult<TConcept> => promiseSettledResult.status === "fulfilled")
    .map((promiseSettledResult) => promiseSettledResult.value);

  return { rootConcepts: rootConceptsResults, concepts: conceptsResults };
};
