import { TConcept } from "@types";

// Define the root level concepts
const ROOT_LEVEL_CONCEPTS = {
  Q1651: "Targets",
  Q709: "Sectors",
  Q975: "Climate risk",
  Q638: "Fossil fuels",
  Q672: "Impacted groups",
  Q1337: "Finance",
  Q1171: "Instruments",
  Q218: "Greenhouse gases",
};

interface ProcessedConcept {
  rootConcept: string;
  count: number;
  wikibaseId: string;
}

export const processConcepts = (concepts: (TConcept & { count: number })[]): { [key: string]: number } => {
  const conceptMap: { [key: string]: number } = {};
  let otherCount = 0;

  concepts.forEach((concept) => {
    let isRootOrSubconcept = false;

    // Check if concept is one of our preset root level concepts
    const isRootLevelConcept = concept.wikibase_id in ROOT_LEVEL_CONCEPTS;
    if (isRootLevelConcept) {
      const rootConceptName = ROOT_LEVEL_CONCEPTS[concept.wikibase_id];
      conceptMap[rootConceptName] = (conceptMap[rootConceptName] || 0) + concept.count;
      isRootOrSubconcept = true;
    }

    // Check if any of the current concept's parent concepts are root level concepts
    const hasRootLevelParent = concept.subconcept_of.some((parentId) => parentId in ROOT_LEVEL_CONCEPTS);
    if (hasRootLevelParent) {
      // Find and increment all root level parent concepts
      concept.subconcept_of.forEach((parentId) => {
        if (ROOT_LEVEL_CONCEPTS[parentId]) {
          const rootConceptName = ROOT_LEVEL_CONCEPTS[parentId];
          conceptMap[rootConceptName] = (conceptMap[rootConceptName] || 0) + concept.count;
        }
      });
      isRootOrSubconcept = true;
    }

    // If not a root or subconcept of a root, add to other
    if (!isRootOrSubconcept) {
      otherCount += concept.count;
    }
  });

  // Add Other category if there are any other concepts
  if (otherCount > 0) {
    conceptMap["Other"] = otherCount;
  }

  return conceptMap;
};

export const ROOT_LEVEL_CONCEPT_LINKS = Object.entries(ROOT_LEVEL_CONCEPTS).reduce(
  (acc, [qNum, name]) => {
    acc[name] = `https://climatepolicyradar.wikibase.cloud/wiki/Item:${qNum}`;
    return acc;
  },
  {} as { [key: string]: string }
);
