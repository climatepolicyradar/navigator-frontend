import { TFiltersGroupConfig, TSearchQueryGroup } from "@/types";

import { filterQueryGroupRules, isLabelRuleOfTypes } from "./filterQueryGroupRules";

/**
 * Narrow a filter group to the rules a given set of filter controls can apply.
 *
 * The filters param is shared between searches, so it can hold rules the controls on show do not
 * offer - a link from the results page carries its whole tree to a passage search, which only
 * filters on topics. Date rules survive only where a datepicker group is on show, which is the
 * only control that can clear one.
 */
export const filterGroupFilters = (group: TSearchQueryGroup | null, filterGroups: TFiltersGroupConfig[]): TSearchQueryGroup | null => {
  const labelTypes = filterGroups.flatMap((filterGroup) => filterGroup.rootLabelTypes);
  const hasDatepicker = filterGroups.some((filterGroup) => filterGroup.container === "datepicker");
  const isOwnedLabelRule = isLabelRuleOfTypes(labelTypes);

  return filterQueryGroupRules(group, (rule) => (rule.field === "attributes.published_date" ? hasDatepicker : isOwnedLabelRule(rule)));
};
