import { TConcept } from "@/types";

const conceptIsOfType = (conceptQueryStringValue: string, type: string) => {
  return conceptQueryStringValue.includes(type);
};

// Function to filter selected concepts
export const FilterSelectedConcepts = (
  currentSelectedConcepts: string[],
  selectedConcept: TConcept,
  relatedConcepts: TConcept[],
  rootOfSelectedConcept: TConcept = undefined,
  isRootConceptExclusive: boolean
) => {
  const selectedConceptLabel = selectedConcept.wikibase_id;

  let selectedConcepts = [...currentSelectedConcepts];

  if (selectedConcepts.includes(selectedConceptLabel)) {
    // deselections
    // case 1a: root concept selected, previously selected, remove all child concepts
    if (!rootOfSelectedConcept) {
      selectedConcepts = selectedConcepts.filter((c) => c !== selectedConceptLabel);
      selectedConcepts = selectedConcepts.filter((c) => !relatedConcepts.map((rc) => rc.wikibase_id).includes(c));
    }
    // case 1b: child concept selected, previously selected
    // - check the root concept, if not selected, remove all concepts and reselect root and concept
    if (rootOfSelectedConcept) {
      if (!selectedConcepts.includes(rootOfSelectedConcept.wikibase_id)) {
        selectedConcepts = [rootOfSelectedConcept.wikibase_id, selectedConceptLabel];
      } else {
        selectedConcepts = selectedConcepts.filter((c) => c !== selectedConceptLabel);
      }
    }
  } else {
    // selections
    // case 1a: root concept selected, not previously selected
    // - remove all other concepts of same type
    // - retain other concepts of different types
    // if isRootConceptExclusive is false, we allow multiple selections of root and child concepts
    if (!rootOfSelectedConcept) {
      if (isRootConceptExclusive) {
        // only remove concepts of the same type as the selected root concept
        selectedConcepts = selectedConcepts.filter((c) => {
          return !conceptIsOfType(c, selectedConcept.type);
        });
      }
      selectedConcepts = [...selectedConcepts, selectedConceptLabel];
    }
    if (rootOfSelectedConcept) {
      const rootConceptLabel = rootOfSelectedConcept?.wikibase_id;
      // case 1b: child concept selected, not previously selected & root concept was selected
      if (selectedConcepts.includes(rootConceptLabel)) {
        selectedConcepts = [...selectedConcepts, selectedConceptLabel];
      } else {
        // case 1c: child concept selected, not previously selected & root concept not selected
        // - remove all other concepts of same type
        // - retain other concepts of different types
        // if isRootConceptExclusive is false, we allow multiple selections of root and child concepts
        if (isRootConceptExclusive) {
          // only remove concepts of the same type as the selected root concept
          selectedConcepts = selectedConcepts.filter((c) => {
            return !conceptIsOfType(c, selectedConcept.type);
          });
        }
        selectedConcepts = [...selectedConcepts, selectedConceptLabel, rootConceptLabel];
      }
    }
  }

  return selectedConcepts;
};
