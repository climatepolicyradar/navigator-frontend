import { TLabel } from "@/types";

export const flattenNestedLabels = (labels: TLabel[]): TLabel[] => labels.flatMap((label) => [label, ...flattenNestedLabels(label.children || [])]);
