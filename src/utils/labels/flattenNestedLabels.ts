import { TNestedSearchLabel } from "@/types";

export const flattenNestedLabels = (labels: TNestedSearchLabel[]): TNestedSearchLabel[] =>
  labels.flatMap((label) => [label, ...flattenNestedLabels(label.children)]);
