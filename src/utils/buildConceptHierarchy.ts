import { TFamilyConcept } from "@/types";

export type TFamilyConceptTreeNode = TFamilyConcept & {
  children: TFamilyConceptTreeNode[];
};

function buildTree(concept: TFamilyConcept, allConcepts: TFamilyConcept[], visited: Set<string>): TFamilyConceptTreeNode {
  // If the concept has already been visited, return it with no children to avoid cycles
  if (visited.has(concept.id)) {
    return {
      ...concept,
      children: [],
    };
  }
  visited.add(concept.id);

  // Find all direct children for this concept (same type)
  const children = allConcepts
    .filter((child) => child.subconcept_of_labels.includes(concept.preferred_label) && child.type === concept.type)
    .map((child) => buildTree(child, allConcepts, new Set(visited)));

  // If there are no children, return the node as is
  if (children.length === 0) {
    return {
      ...concept,
      children: [],
    };
  }

  // For each child, create a separate tree (one per parent-child relationship)
  return {
    ...concept,
    children: children.map((child) => ({
      ...child,
      children: child.children, // preserve grandchildren
    })),
  };
}

export function buildConceptHierarchy(concepts?: TFamilyConcept[]): TFamilyConceptTreeNode[] {
  // Root concepts: those with no parents
  const roots = concepts?.filter((concept) => concept.subconcept_of_labels.length === 0) || [];

  // Build the tree for each root
  return roots.map((root) => buildTree(root, concepts || [], new Set()));
}
