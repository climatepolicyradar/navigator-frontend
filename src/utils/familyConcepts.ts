export type FamilyConcept = {
  relation: "category" | "jurisdiction" | "principle_law";
  preferred_label: string;
  subconcept_of_labels: string[];
};

export function groupFamilyConcepts(items: FamilyConcept[]) {
  const rootFamilyConcepts = items.filter((item) => item.subconcept_of_labels.length === 0);
  const findRootAncestor = (item: FamilyConcept) => {
    const root = rootFamilyConcepts.find((root) => item.subconcept_of_labels.find((label) => label === root.preferred_label));
    return root;
  };

  const groupedByRoot = Object.groupBy(items, (item: FamilyConcept) => {
    if (item.subconcept_of_labels.length === 0) {
      return item.preferred_label;
    } else {
      const root = findRootAncestor(item);
      if (!root) {
        // We shouldn't really reach this - but the data is whacky
        // so: Fallback to the item's preferred label
        return item.preferred_label;
      }
      return root.preferred_label;
    }
  });

  // Order these by how many subconcepts they have
  // And then their preferred_label
  for (const group in groupedByRoot) {
    groupedByRoot[group].sort((a, b) => {
      if (a.subconcept_of_labels.length === b.subconcept_of_labels.length) {
        return a.preferred_label.localeCompare(b.preferred_label);
      }
      return a.subconcept_of_labels.length - b.subconcept_of_labels.length;
    });
  }
  return groupedByRoot;
}
