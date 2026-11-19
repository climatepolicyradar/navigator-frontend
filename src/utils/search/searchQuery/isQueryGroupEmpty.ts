import { isRule, TSearchQueryGroup } from "@/types";

export const isQueryGroupEmpty = (filters: TSearchQueryGroup | null): boolean => {
  if (!filters) return true;
  if (filters.filters.length === 0) return true;
  return !filters.filters.some((filter) => {
    if (isRule(filter)) return filter.value.trim().length > 0;
    return !isQueryGroupEmpty(filter);
  });
};
