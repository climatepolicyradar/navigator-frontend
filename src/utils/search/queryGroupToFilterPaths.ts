import { TFilterPathLabel, TSearchQueryGroup, TSearchQueryRule, isRule } from "@/types";

type TLabelRule = TSearchQueryRule & { field: "labels.value.id" };

const isLabelRule = (node: TSearchQueryGroup | TSearchQueryRule): node is TLabelRule => isRule(node) && node.field === "labels.value.id";

const ruleToLabel = (rule: TLabelRule): TFilterPathLabel => {
  const [type, value] = rule.value.split("::");
  return { id: rule.value, type, value };
};

const extractPaths = (node: TSearchQueryGroup | TSearchQueryRule, ancestors: TFilterPathLabel[]): TFilterPathLabel[][] => {
  if (isLabelRule(node)) {
    if (node.checked) return [[ruleToLabel(node), ...ancestors]];
    return [];
  }

  if (isRule(node)) return [];

  if (node.op === "or") return node.filters.flatMap((filters) => extractPaths(filters, ancestors));

  const [firstFilter, ...otherFilters] = node.filters;

  if (isLabelRule(firstFilter) && !firstFilter.checked) {
    return otherFilters.flatMap((filters) => extractPaths(filters, [ruleToLabel(firstFilter), ...ancestors]));
  }

  if (isLabelRule(firstFilter) && firstFilter.checked && ancestors.length === 0) {
    // Root-level AND with a checked first rule: firstFilter is a selected parent with a child filter
    return [[ruleToLabel(firstFilter)], ...otherFilters.flatMap((filter) => extractPaths(filter, [ruleToLabel(firstFilter)]))];
  }

  return node.filters.flatMap((filter) => extractPaths(filter, ancestors));
};

export const queryGroupToFilterPaths = (searchQueryGroup: TSearchQueryGroup): TFilterPathLabel[][] => extractPaths(searchQueryGroup, []);
