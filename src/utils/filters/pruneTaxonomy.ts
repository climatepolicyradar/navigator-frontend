import { TNestedSearchLabel } from "@/types";

type TPrunedLabel = {
  label: TNestedSearchLabel;
  total: number;
};

const pruneLabel = (label: TNestedSearchLabel): TPrunedLabel => {
  const children = label.children.map(pruneLabel);
  const total = (label.count ?? 0) + children.reduce((sum, child) => sum + child.total, 0);
  const kept = children.filter((child) => child.total > 0).map((child) => child.label);
  return { label: { ...label, children: kept }, total };
};

export const pruneTaxonomy = (labels: TNestedSearchLabel[]): TNestedSearchLabel[] => {
  const counted = labels.map(pruneLabel).filter((node) => node.total > 0);
  return counted.length > 0 ? counted.map((node) => node.label) : labels;
};
