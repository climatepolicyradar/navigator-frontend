import type { TQueryGroup } from "@/components/_experiment/queryBuilder/QueryBuilder";

type TAggregationRow = {
  value?: { id?: string } | null;
};

type TWithId = { id: string };

function isFilterTreeEmpty(group: TQueryGroup | null | undefined): boolean {
  if (!group || !group.filters || group.filters.length === 0) return true;

  for (const f of group.filters) {
    if ("value" in f) {
      return false;
    }
    if (!isFilterTreeEmpty(f)) {
      return false;
    }
  }

  return true;
}

/**
 * When the user has a text query or at least one filter, returns the set of label
 * ids that appear in the current search aggregations. Otherwise returns undefined
 * (caller should treat all catalogue labels as selectable).
 *
 * @param aggregations Label buckets from the search documents response, if any.
 * @param query URL / committed search text.
 * @param filters Structured filter tree.
 * @returns Set of ids, or undefined when aggregation-based constraining does not apply.
 */
export function getAvailableLabelIdsFromAggregations(
  aggregations: TAggregationRow[] | undefined,
  query: string | undefined,
  filters: TQueryGroup | null | undefined
): Set<string> | undefined {
  const hasQuery = !!(query && query.trim().length > 0);
  const hasAnyFilters = !isFilterTreeEmpty(filters);
  const shouldConstrain = hasQuery || hasAnyFilters;

  if (!shouldConstrain || !aggregations || aggregations.length === 0) {
    return undefined;
  }

  const ids: string[] = [];
  for (const agg of aggregations) {
    const id = agg?.value?.id;
    if (typeof id === "string") {
      ids.push(id);
    }
  }

  if (ids.length === 0) {
    return undefined;
  }

  return new Set(ids);
}

/**
 * Split labels into selectable and disabled groups using availability ids.
 *
 * @param labels Labels to split (assumed already sorted if ordering matters).
 * @param availableLabelIds Set of available ids; undefined means all selectable.
 * @returns Partitioned label arrays preserving original order.
 */
export function partitionByAvailability<T extends TWithId>(
  labels: T[],
  availableLabelIds: ReadonlySet<string> | undefined
): { enabled: T[]; disabled: T[] } {
  if (!availableLabelIds) {
    return { enabled: labels, disabled: [] };
  }

  const enabled: T[] = [];
  const disabled: T[] = [];

  for (const label of labels) {
    if (availableLabelIds.has(label.id)) {
      enabled.push(label);
    } else {
      disabled.push(label);
    }
  }

  return { enabled, disabled };
}
