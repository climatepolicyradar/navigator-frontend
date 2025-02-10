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

interface Concept {
  name: string;
  count: number;
  wikibaseId: string;
}

interface ConceptMap {
  [subconcept: string]: Concept;
}

interface RootConceptsMapped {
  [rootConcept: string]: ConceptMap;
}

export const processConcepts = (concepts: (TConcept & { count: number })[]): RootConceptsMapped => {
  const conceptMap: RootConceptsMapped = {};
  let otherConcepts: ConceptMap = {};

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

export const ROOT_LEVEL_CONCEPT_LINKS = Object.entries(ROOT_LEVEL_CONCEPTS).reduce(
  (acc, [qNum, name]) => {
    acc[name] = `https://climatepolicyradar.wikibase.cloud/wiki/Item:${qNum}`;
    return acc;
  },
  {} as { [key: string]: string }
);
