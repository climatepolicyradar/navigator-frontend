import { TSearchQueryGroup, TSearchQueryRule } from "@/types";
import { createQueryGroup } from "@/utils/search/searchQuery/createQueryGroup";

export function sanitiseSearchQueryGroup(group: TSearchQueryGroup): TSearchQueryGroup {
  // Recursively remove empty-value rules and empty nested groups from a filter tree.
  const stripGroup = (node: TSearchQueryGroup): TSearchQueryGroup | null => {
    const filters: Array<TSearchQueryGroup | TSearchQueryRule> = [];

    for (const filter of node.filters) {
      if ("field" in filter) {
        if (filter.value.trim().length === 0) continue;
        if ("checked" in filter) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { checked: _checked, ...rule } = filter;
          filters.push(rule as TSearchQueryRule);
        } else {
          filters.push(filter);
        }
        continue;
      }

      const stripped = stripGroup(filter);
      if (stripped && stripped.filters.length > 0) {
        filters.push(stripped);
      }
    }

    if (filters.length === 0) return null;
    return { ...node, filters };
  };

  return stripGroup(group) ?? createQueryGroup();
}
