import { TDateRange } from "@/context/FiltersContext";
import { TFilterPathLabel, TSearchQueryGroup, TSearchQueryRule, isRule } from "@/types";

type TLabelRule = TSearchQueryRule & { field: "labels.value.id" };
type TDateRule = TSearchQueryRule & { field: "attributes.published_date" };

const isDateRule = (node: TSearchQueryGroup | TSearchQueryRule): node is TDateRule => isRule(node) && node.field === "attributes.published_date";

const getYear = (value: string): number => new Date(value).getFullYear();

const extractDateRange = (node: TSearchQueryGroup): TDateRange => {
  if (node.op !== "and") return null;

  const dateRules = node.filters.filter(isDateRule);
  const gteRule = dateRules.find((rule) => rule.op === "gte");
  const lteRule = dateRules.find((rule) => rule.op === "lte");

  if (gteRule && lteRule) return [getYear(gteRule.value), getYear(lteRule.value)];
  if (gteRule) return [getYear(gteRule.value), new Date().getFullYear()];
  return null;
};

const isLabelRule = (node: TSearchQueryGroup | TSearchQueryRule): node is TLabelRule => isRule(node) && node.field === "labels.value.id";

const ruleToLabel = (rule: TLabelRule): TFilterPathLabel => {
  const [type, value] = rule.value.split("::");
  return { id: rule.value, type, value };
};

const extractPaths = (node: TSearchQueryGroup | TSearchQueryRule, ancestors: TFilterPathLabel[]): TFilterPathLabel[][] => {
  /* Rules */

  if (isLabelRule(node)) {
    if (node.checked) return [[ruleToLabel(node), ...ancestors]];
    return [];
  }
  if (isRule(node)) return []; // TODO likely needs changing when applying date filtering

  /* Siblings */

  if (node.op === "or") return node.filters.flatMap((filters) => extractPaths(filters, ancestors));

  /* More complex nesting */

  const [firstFilter, ...otherFilters] = node.filters;

  if (isLabelRule(firstFilter) && !firstFilter.checked) {
    return otherFilters.flatMap((filters) => extractPaths(filters, [ruleToLabel(firstFilter), ...ancestors]));
  }

  if (isLabelRule(firstFilter) && firstFilter.checked) {
    const firstLabel = ruleToLabel(firstFilter);
    const childAncestors = [firstLabel, ...ancestors];
    return [
      [firstLabel, ...ancestors],
      ...otherFilters.flatMap((filter) =>
        !isRule(filter) && filter.op === "or" ? extractPaths(filter, childAncestors) : extractPaths(filter, ancestors)
      ),
    ];
  }

  return node.filters.flatMap((filter) => extractPaths(filter, ancestors));
};

export const queryGroupToFilterPaths = (searchQueryGroup: TSearchQueryGroup): { filterPathLabels: TFilterPathLabel[][]; dateRange: TDateRange } => ({
  filterPathLabels: extractPaths(searchQueryGroup, []),
  dateRange: extractDateRange(searchQueryGroup),
});
