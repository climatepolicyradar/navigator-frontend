import { TSearchLabel } from "@/types";

export const getSearchLabelValues = (labels: TSearchLabel[]): Record<string, string> =>
  Object.fromEntries(labels.map(({ id, value }) => [id, value]));
