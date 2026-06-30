import { TNestedSearchLabel, TSearchLabel } from "@/types";

export const nestSearchLabels = (labels: TSearchLabel[]): TNestedSearchLabel[] => {
  const labelsMap = new Map<string, TNestedSearchLabel>(labels.map((label) => [label.id, { ...label, children: [] as TNestedSearchLabel[] }]));
  const rootLabels: TNestedSearchLabel[] = [];

  for (const label of labels) {
    const node = labelsMap.get(label.id)!;
    const parentRelations = label.labels.filter((lbl) => lbl.type === "subconcept_of");

    if (parentRelations.length === 0) {
      rootLabels.push(node);
    } else {
      let addedToParent = false;

      for (const parentRelation of parentRelations) {
        const parent = labelsMap.get(parentRelation.value.id);

        if (parent) {
          parent.children.push(node);
          addedToParent = true;
        }
      }

      if (!addedToParent) rootLabels.push(node);
    }
  }

  return rootLabels;
};
