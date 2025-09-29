import { TConcept } from "@/types";

// Define the root level concepts
export const ROOT_LEVEL_CONCEPTS = {
  Q1651: "Targets",
  Q709: "Sectors",
  Q975: "Climate risk",
  Q638: "Fossil fuels",
  Q672: "Impacted groups",
  Q1343: "Climate finance",
  Q1171: "Instruments",
  Q218: "Greenhouse gases",
  Q1367: "Public finance actors",
  Q47: "Just transition",
  Q567: "Renewable energy",
};
export const rootLevelConceptsIds = Object.keys(ROOT_LEVEL_CONCEPTS);

const fetchConcept = async (conceptId: string): Promise<TConcept> => {
  return fetch(`https://cdn.climatepolicyradar.org/concepts/${conceptId}.json`).then((response) => response.json());
};

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

interface IConcept {
  name: string;
  count: number;
  wikibaseId: string;
}

interface IConceptMap {
  [subconcept: string]: IConcept;
}

interface IRootConceptsMapped {
  [rootConcept: string]: IConceptMap;
}

export const processConcepts = (concepts: (TConcept & { count: number })[]): IRootConceptsMapped => {
  const conceptMap: IRootConceptsMapped = {};
  const otherConcepts: IConceptMap = {};

  concepts.forEach((concept) => {
    let isRootOrSubconcept = false;

    // Check if concept is one of our preset root level concepts
    const isRootLevelConcept = concept.wikibase_id in ROOT_LEVEL_CONCEPTS;
    if (isRootLevelConcept) {
      const rootConceptName = ROOT_LEVEL_CONCEPTS[concept.wikibase_id];
      if (!conceptMap[rootConceptName]) {
        conceptMap[rootConceptName] = {};
      }
      conceptMap[rootConceptName][concept.preferred_label] = {
        name: concept.preferred_label,
        count: (conceptMap[rootConceptName][concept.preferred_label]?.count || 0) + concept.count,
        wikibaseId: concept.wikibase_id,
      };
      isRootOrSubconcept = true;
    }

    // Check if any of the current concept's parent concepts are root level concepts
    const rootLevelParents = concept.subconcept_of.filter((parentId) => parentId in ROOT_LEVEL_CONCEPTS);
    if (rootLevelParents.length > 0) {
      // Find and increment all root level parent concepts
      rootLevelParents.forEach((parentId) => {
        const rootConceptName = ROOT_LEVEL_CONCEPTS[parentId];
        if (!conceptMap[rootConceptName]) {
          conceptMap[rootConceptName] = {};
        }
        conceptMap[rootConceptName][concept.preferred_label] = {
          name: concept.preferred_label,
          count: (conceptMap[rootConceptName][concept.preferred_label]?.count || 0) + concept.count,
          wikibaseId: concept.wikibase_id,
        };
      });
      isRootOrSubconcept = true;
    }

    // If not a root or subconcept of a root, add to other
    if (!isRootOrSubconcept) {
      otherConcepts[concept.preferred_label] = {
        name: concept.preferred_label,
        count: (otherConcepts[concept.preferred_label]?.count || 0) + concept.count,
        wikibaseId: concept.wikibase_id,
      };
    }
  });

  // Add Other category if there are any other concepts
  if (Object.keys(otherConcepts).length > 0) {
    conceptMap["Other"] = otherConcepts;
  }

  return conceptMap;
};
