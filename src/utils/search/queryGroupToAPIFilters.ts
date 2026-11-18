import { LABEL_SEARCH_REPLACEMENTS } from "@/constants/labels";
import { TSearchQueryGroup, TSearchQueryRule, isRule } from "@/types";

const replaceNode = (node: TSearchQueryGroup | TSearchQueryRule): TSearchQueryGroup | TSearchQueryRule => {
  if (!isRule(node)) return queryGroupToAPIFilters(node);

  const replacement = LABEL_SEARCH_REPLACEMENTS.find(
    ({ idMatch }) => node.field === "labels.value.id" && node.op === "contains" && node.value === idMatch
  );
  return replacement ? replacement.filter : node;
};

export const queryGroupToAPIFilters = (searchQueryGroup: TSearchQueryGroup): TSearchQueryGroup => ({
  ...searchQueryGroup,
  filters: searchQueryGroup.filters.map(replaceNode),
});
