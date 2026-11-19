import { TSearchQueryGroup } from "@/types";

export const DATE_RANGE_MIN_YEAR = 1900;

export function hasPublishedDateRule(group: TSearchQueryGroup | null | undefined): boolean {
  if (!group) return false;
  return group.filters.some((filter) => {
    if ("field" in filter) return filter.field === "attributes.published_date";
    return hasPublishedDateRule(filter);
  });
}
