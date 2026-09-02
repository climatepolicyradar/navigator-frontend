import { TDateRange } from "@/context/FiltersContext";
import { TFilterPathLabel, TSearchQueryGroup, TSearchQueryRule } from "@/types";

export const DEFAULT_SEARCH_QUERY_GROUP: TSearchQueryGroup = { op: "and", filters: [{ field: "labels.value.id", op: "contains", value: "" }] };

const makeRule = (value: string, checked?: true): TSearchQueryRule => ({
  field: "labels.value.id",
  op: "contains",
  value,
  // Encode whether the label was checked by the user so it can be reverse-engineered
  ...(checked && { checked }),
});

const wrapInGroup = (result: TSearchQueryGroup | TSearchQueryRule): TSearchQueryGroup =>
  "field" in result ? { op: "or", filters: [result] } : result;

const buildGroupFromPaths = (labelPaths: TFilterPathLabel[][], checkedIds: Set<string>): TSearchQueryGroup | TSearchQueryRule => {
  const rootLabelsById = new Map<string, TFilterPathLabel[][]>();
  for (const labelPath of labelPaths) {
    const key = labelPath[0].id;
    const bucket = rootLabelsById.get(key) ?? [];
    bucket.push(labelPath);
    rootLabelsById.set(key, bucket);
  }

  const rootResults: [string, TSearchQueryGroup | TSearchQueryRule][] = [];
  for (const [rootId, rootPaths] of rootLabelsById) {
    const rootType = rootPaths[0][0].type;
    const childPaths = rootPaths.map((path) => path.slice(1)).filter((path) => path.length > 0);
    const rootRule = makeRule(rootId, checkedIds.has(rootId) ? true : undefined);

    if (childPaths.length === 0) {
      rootResults.push([rootType, rootRule]);
    } else {
      const childResult = buildGroupFromPaths(childPaths, checkedIds);
      rootResults.push([rootType, { op: "and", filters: [rootRule, wrapInGroup(childResult)] }]);
    }
  }

  const labelsByType = new Map<string, (TSearchQueryGroup | TSearchQueryRule)[]>();
  for (const [type, result] of rootResults) {
    const bucket = labelsByType.get(type) ?? [];
    bucket.push(result);
    labelsByType.set(type, bucket);
  }

  const typeGroupResults: (TSearchQueryGroup | TSearchQueryRule)[] = [];
  for (const results of labelsByType.values()) {
    typeGroupResults.push(results.length === 1 ? results[0] : { op: "or", filters: results });
  }

  if (typeGroupResults.length === 1) return typeGroupResults[0];
  return { op: "and", filters: typeGroupResults };
};

const buildDateRangeFilters = ([startYear, endYear]: [number, number]): TSearchQueryRule[] => [
  { field: "attributes.published_date", key: "published_date", op: "gte", value: `${startYear}-01-01T00:00:00.000Z` },
  { field: "attributes.published_date", key: "published_date", op: "lte", value: `${endYear}-12-31T23:59:59.999Z` },
];

export const filterPathsToQueryGroup = (allLabelPaths: TFilterPathLabel[][], dateRange: TDateRange): TSearchQueryGroup => {
  let result: TSearchQueryGroup;

  if (allLabelPaths.length === 0) {
    result = DEFAULT_SEARCH_QUERY_GROUP;
  } else {
    // Keep track of which actual checkboxes were checked by the user
    const checkedIds = new Set(allLabelPaths.map((path) => path[0].id));

    // Build from least to most specific label in the path
    const reversedLabelPaths = allLabelPaths.map((labelPath) => [...labelPath].reverse());
    const deduplicatedLabelPaths = reversedLabelPaths.filter(
      (labelPath) =>
        !reversedLabelPaths.some(
          (otherLabelPath) =>
            otherLabelPath !== labelPath &&
            otherLabelPath.length > labelPath.length &&
            labelPath.every((label, labelIndex) => label.id === otherLabelPath[labelIndex].id)
        )
    );

    result = wrapInGroup(buildGroupFromPaths(deduplicatedLabelPaths, checkedIds));
  }

  if (dateRange === null) return result;

  // Add the date range to the top level AND group or create one
  const dateFilters = buildDateRangeFilters(dateRange);
  return result.op === "and" ? { ...result, filters: [...result.filters, ...dateFilters] } : { op: "and", filters: [result, ...dateFilters] };
};
