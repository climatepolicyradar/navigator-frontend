import { TSearchQueryGroup, TSearchQueryRule } from "@/types";

const createRule = (): TSearchQueryRule => {
  return { field: "labels.value.id", op: "contains", value: "" };
};

export const createQueryGroup = (): TSearchQueryGroup => {
  return { op: "and", filters: [createRule()] };
};
