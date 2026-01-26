import { TTopic } from "@/types";

// TODO: remove this concept tech-debt
// Ticket: APP-711
const DISABLED_CONCEPTS = ["Q777", "Q778", "Q221"];

export const groupByRootConcept = (concepts: TTopic[], rootConcepts: TTopic[]): { [rootConceptId: string]: TTopic[] } => {
  const otherRootConcept: TTopic = {
    wikibase_id: "Q000",
    preferred_label: "Other",
    subconcept_of: [],
    recursive_subconcept_of: [],
    alternative_labels: [],
    negative_labels: [],
    description: "",
    related_concepts: [],
    has_subconcept: [],
  };

  // TODO: remove this concept tech-debt
  // Ticket: APP-711
  const conceptsWithoutDisabled = concepts.filter((concept) => !DISABLED_CONCEPTS.includes(concept.wikibase_id));

  return Object.groupBy(conceptsWithoutDisabled, (concept) => {
    const rootConcept = rootConcepts.find((rootConcept) => concept.recursive_subconcept_of.includes(rootConcept.wikibase_id));
    const isRootConcept = rootConcepts.some((rootConcept) => rootConcept.wikibase_id === concept.wikibase_id);

    /**
     * 1. if it has a root concept, add to that list
     * 2. if it is a root concept, add to itself
     * 3. otherwise add to other
     */
    const rootConceptId = rootConcept?.wikibase_id ?? (isRootConcept ? concept.wikibase_id : otherRootConcept.wikibase_id);
    return rootConceptId;
  });
};
