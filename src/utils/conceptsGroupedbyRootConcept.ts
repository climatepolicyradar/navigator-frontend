import { TConcept } from "@/types";

export const groupByRootConcept = (concepts: TConcept[], rootConcepts: TConcept[]): { [rootConceptId: string]: TConcept[] } => {
  const otherRootConcept: TConcept = {
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

  return Object.groupBy(concepts, (concept) => {
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
