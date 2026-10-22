import { TFiltersGroup, TNestedSearchLabel, TSearchQueryGroup } from "@/types";

import { filterQueryGroupRules, isLabelRuleOfTypes } from "./filterQueryGroupRules";

// A group's rootLabelTypes name only what sits at the top of its tree, so the types it can apply
// are collected from the prepared labels themselves - Geography is rooted on regions but offers
// the countries nested beneath them too.
const labelTreeTypes = (labels: TNestedSearchLabel[]): string[] => labels.flatMap((label) => [label.type, ...labelTreeTypes(label.children ?? [])]);

/**
 * Narrow a filter group to the rules a given set of filter controls can apply.
 *
 * The filters param is shared between searches, so it can hold rules the controls on show do not
 * offer - a link from the results page carries its whole tree to a passage search, which only
 * filters on topics. Date rules survive only where a datepicker group is on show, which is the
 * only control that can clear one.
 */
export const filterGroupFilters = (group: TSearchQueryGroup | null, filterGroups: TFiltersGroup[]): TSearchQueryGroup | null => {
  const labelTypes = filterGroups.flatMap((filterGroup) => [...filterGroup.rootLabelTypes, ...labelTreeTypes(filterGroup.nestedLabels ?? [])]);
  const hasDatepicker = filterGroups.some((filterGroup) => filterGroup.container === "datepicker");
  const isOwnedLabelRule = isLabelRuleOfTypes(labelTypes);

  return filterQueryGroupRules(group, (rule) => (rule.field === "attributes.published_date" ? hasDatepicker : isOwnedLabelRule(rule)));
};
