import { TFamilyConcept } from "@/types";

export type TFamilyConceptTreeNode = TFamilyConcept & {
  children: TFamilyConceptTreeNode[];
};

function buildTree(concept: TFamilyConcept, allConcepts: TFamilyConcept[], visited: Set<string>): TFamilyConceptTreeNode {
  // If the concept has already been visited, return it with no children to avoid cycles
  // This is important to prevent infinite loops in case of cyclic references
  if (visited.has(concept.id)) {
    return {
      ...concept,
      children: [],
    };
  }
  visited.add(concept.id);

  // find concepts where this concept is a parent and of the same type
  const children = allConcepts
    .filter((child) => child.subconcept_of_labels.includes(concept.preferred_label) && child.type === concept.type)
    .map((child) => buildTree(child, allConcepts, new Set(visited)));

  return {
    ...concept,
    children,
  };
}

export function buildConceptHierarchy(concepts?: TFamilyConcept[]): TFamilyConceptTreeNode[] {
  // Root concepts: those with no parents
  const roots = concepts?.filter((concept) => concept.subconcept_of_labels.length === 0) || [];

  // Build the tree for each root
  return roots.map((root) => buildTree(root, concepts || [], new Set()));
}
