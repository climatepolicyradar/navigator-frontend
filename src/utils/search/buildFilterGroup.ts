import { TFilterPathLabel, TSearchQueryGroup, TSearchQueryRule } from "@/types";

export const buildFilterGroup = (allPathLabels: TFilterPathLabel[][]): TSearchQueryGroup | TSearchQueryRule => {
  // TODO
  return { op: "or", filters: [] };
};
