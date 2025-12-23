import { TConcept } from "@/types";

export type FamilyConcept = {
  relation: "category" | "jurisdiction" | "principal_law";
  preferred_label: string;
  subconcept_of_labels: string[];
};

export function getRecursiveParentLabels(item: FamilyConcept, items: FamilyConcept[]): string[] {
  // Get all recursive parents
  const parentLabels = item.subconcept_of_labels.flatMap((label) => {
    return items.filter((i) => i.preferred_label === label);
  });

  // If there are no parents, return an empty array
  if (parentLabels.length === 0) {
    return [];
  }

  // Otherwise, recursively get the labels of the parents
  const recursiveParentLabels = parentLabels.flatMap((parent) => {
    const parentIdentifier = parent.relation ? `${parent.relation}/${parent.preferred_label}` : parent.preferred_label;
    return [parentIdentifier, ...getRecursiveParentLabels(parent, items)];
  });

  // we reverse this to make sure we have the root parent first and
  return recursiveParentLabels.toReversed();
}

export function mapFamilyConceptsToConcepts(familyConcepts: FamilyConcept[]): TConcept[] {
  return familyConcepts.map<TConcept>((familyConcept) => {
    return {
      wikibase_id: `${familyConcept.relation}/${familyConcept.preferred_label}`,
      preferred_label: familyConcept.preferred_label,
      subconcept_of: familyConcept.subconcept_of_labels,
      recursive_subconcept_of: getRecursiveParentLabels(familyConcept, familyConcepts),
      type: familyConcept.relation,
      alternative_labels: [],
      negative_labels: [],
      description: "",
      related_concepts: [],
      has_subconcept: [],
    };
  });
}
