import { isRule, TSearchQueryGroup, TSearchQueryRule } from "@/types";

export function isFilterGroupEmpty(filters: TSearchQueryGroup | null): boolean {
  if (!filters) return true;
  if (filters.filters.length === 0) return true;
  return !filters.filters.some((filter) => {
    if (isRule(filter)) return filter.value.trim().length > 0;
    return !isFilterGroupEmpty(filter);
  });
}

function createRule(): TSearchQueryRule {
  return { field: "labels.value.id", op: "contains", value: "" };
}

export function createGroup(): TSearchQueryGroup {
  return { op: "and", filters: [createRule()] };
}
