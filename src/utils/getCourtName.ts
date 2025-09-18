import { TFamilyConcept, TFamilyMetadata } from "@/types";

/**
 * Extracts the court name from a hierarchy of legal entity concepts.
 * Returns the last (most specific) part of the hierarchy.
 *
 * @param concepts - Array of family concepts from API
 * @returns The court name (last part of hierarchy) or null if not found
 */
export function getCourtName(concepts: TFamilyConcept[]): string | null {
  // Find all legal entity concepts
  const legalEntities = concepts.filter((concept) => concept.type === "legal_entity");

  if (legalEntities.length === 0) {
    return null;
  }

  // Find the concept with no children (the most specific one)
  const leafConcepts = legalEntities.filter((concept) => {
    // Check if this concept is not a parent of any other legal entity
    return !legalEntities.some((other) => other.subconcept_of_labels.includes(concept.preferred_label));
  });

  // If we found leaf concepts, return the first one's preferred label
  if (leafConcepts.length > 0) {
    return leafConcepts[0].preferred_label;
  }

  // Fallback: if no clear leaf concept, return the last concept in the array
  return legalEntities[legalEntities.length - 1]?.preferred_label || null;
}

/**
 * Extracts the court name from family metadata concept_preferred_label.
 * Returns the last (most specific) part of the hierarchy.
 *
 * @param metadata - Family metadata containing concept_preferred_label
 * @returns The court name (last part of hierarchy) or null if not found
 */
export function getCourtNameFromMetadata(metadata: TFamilyMetadata): string | null {
  const conceptLabels = metadata.concept_preferred_label;

  if (!conceptLabels || conceptLabels.length === 0) {
    return null;
  }

  // Return the last concept label (most specific)
  return conceptLabels[conceptLabels.length - 1];
}
