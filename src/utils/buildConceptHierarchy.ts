import { TFamilyConcept } from "@/types";

export type TFamilyConceptTreeNode = TFamilyConcept & {
  children: TFamilyConceptTreeNode[];
};

// Helper: Build a lookup by preferred_label
function buildLabelMap(concepts: TFamilyConcept[]): Map<string, TFamilyConcept> {
  const map = new Map<string, TFamilyConcept>();
  for (const concept of concepts) {
    map.set(concept.preferred_label, concept);
  }
  return map;
}

// Recursive function to build the tree
function buildTree(
  concept: TFamilyConcept,
  labelMap: Map<string, TFamilyConcept>,
  allConcepts: TFamilyConcept[],
  visited: Set<string>
): TFamilyConceptTreeNode {
  // Prevent cycles
  if (visited.has(concept.id)) {
    throw new Error(`Cycle detected at concept id: ${concept.id}`);
  }
  visited.add(concept.id);

  // Find children: concepts where this concept is a parent
  const children = allConcepts
    .filter((child) => child.subconcept_of_labels.includes(concept.preferred_label))
    .map((child) => buildTree(child, labelMap, allConcepts, new Set(visited)));

  return {
    ...concept,
    children,
  };
}

// Main function to build the full forest (array of root nodes)
export function buildConceptHierarchy(concepts: TFamilyConcept[]): TFamilyConceptTreeNode[] {
  const labelMap = buildLabelMap(concepts);

  // Root concepts: those with no parents
  const roots = concepts.filter((concept) => concept.subconcept_of_labels.length === 0);

  // If a concept has multiple parents, it will appear under each parent branch
  // If there are cycles, an error will be thrown

  // Build the tree for each root
  return roots.map((root) => buildTree(root, labelMap, concepts, new Set()));
}
