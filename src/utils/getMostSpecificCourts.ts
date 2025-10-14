import { TFamilyConcept, TFamilyMetadata, TConcept } from "@/types";

export const getMostSpecificCourts = (concepts: TFamilyConcept[]): TFamilyConcept[] => {
  let courtConcepts = concepts.filter((concept) => concept.type === "legal_entity");
  if (courtConcepts.length === 0) return [];

  // On each loop, remove legal entities without parents. Stops when the deepest level court remains
  while (courtConcepts.length > 1) {
    const moreSpecificConcepts = courtConcepts.filter((concept) =>
      concept.subconcept_of_labels.some((id) => courtConcepts.findIndex((con) => con.id === id) !== -1)
    );

    // Prevent a situation where number of concepts goes from 2 to 0 on the last loop
    if (moreSpecificConcepts.length === 0) {
      return courtConcepts;
    } else {
      courtConcepts = moreSpecificConcepts;
    }
  }

  return courtConcepts;
};

/**
 * Extracts the court name from family metadata concept_preferred_label.
 * Returns the last (most specific) part of the hierarchy.
 *
 * @param metadata - Family metadata containing concept_preferred_label
 * @returns The court name (last part of hierarchy) or null if not found
 */
export function getMostSpecificCourtsFromMetadata(metadata: TFamilyMetadata): string | null {
  const conceptLabels = metadata.concept_preferred_label;

  if (!conceptLabels || conceptLabels.length === 0) {
    return null;
  }

  // Return the last concept label (most specific)
  return conceptLabels[conceptLabels.length - 1];
}

export function getMostSpecificCourtsFromWikiConcepts(concepts: TConcept[]): string | null {
  if (!Array.isArray(concepts) || concepts.length === 0) {
    return null;
  }

  if (concepts.length === 1) {
    return concepts[0].preferred_label || null;
  }

  const specificCourt = concepts.find(
    (concept) =>
      concept.type === "jurisdiction" &&
      Array.isArray(concept.has_subconcept) &&
      concept.has_subconcept.length === 0 &&
      Array.isArray(concept.subconcept_of) &&
      concept.subconcept_of.length > 0
  );

  return specificCourt?.preferred_label || null;
}
