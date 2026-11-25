import { TNestedSearchLabel } from "@/types";

export const flattenCountedLabels = (labels: TNestedSearchLabel[]): TNestedSearchLabel[] => {
  const byId = new Map<string, TNestedSearchLabel>();
  const collect = (nodes: TNestedSearchLabel[]): void => {
    for (const label of nodes) {
      if ((label.count ?? 0) > 0 && !byId.has(label.id)) byId.set(label.id, { ...label, children: [] });
      collect(label.children);
    }
  };
  collect(labels);
  return [...byId.values()];
};
