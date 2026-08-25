import { ID_SEPARATOR } from "@/constants/chars";
import { TSearchQueryGroup, TSearchQueryRule, isRule } from "@/types";

/**
 * Match label rules by the type prefix of their value, e.g. "concept::Q786" is a "concept" rule.
 */
export const isLabelRuleOfTypes =
  (types: string[]) =>
  (rule: TSearchQueryRule): boolean =>
    rule.field === "labels.value.id" && types.includes(rule.value.split(ID_SEPARATOR)[0]);

/**
 * Filter a search group by a rule base upon its type
 * Empty-value rules are always dropped: they carry no filter, and are what an untouched
 * DEFAULT_SEARCH_QUERY_GROUP / createGroup() is made of.
 */
export const filterQueryGroupRules = (group: TSearchQueryGroup | null, keepRule: (rule: TSearchQueryRule) => boolean): TSearchQueryGroup | null => {
  if (!group) return null;

  const filters: (TSearchQueryGroup | TSearchQueryRule)[] = [];

  for (const filter of group.filters) {
    if (isRule(filter)) {
      if (filter.value.trim().length === 0) continue;
      if (keepRule(filter)) filters.push(filter);
      continue;
    }

    const prunedGroup = filterQueryGroupRules(filter, keepRule);
    if (prunedGroup) filters.push(prunedGroup);
  }

  if (filters.length === 0) return null;
  return { ...group, filters };
};
