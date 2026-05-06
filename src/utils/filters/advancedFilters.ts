import { createGroup, TQueryGroup, TQueryRule } from "@/components/_experiment/advancedFilters/AdvancedFilters";

/** Extract all label values from "contains" rules in the filter tree. */
export function extractLabels(group: TQueryGroup | null): string[] {
  if (!group) return [];
  const labels: string[] = [];
  for (const filter of group.filters) {
    if ("field" in filter) {
      if (filter.op === "contains" && filter.value) labels.push(filter.value);
    } else {
      labels.push(...extractLabels(filter));
    }
  }
  return labels;
}

export function stripEmptyValueRules(group: TQueryGroup): TQueryGroup {
  // Recursively remove empty-value rules and empty nested groups from a filter tree.
  const stripGroup = (node: TQueryGroup): TQueryGroup | null => {
    const filters: Array<TQueryGroup | TQueryRule> = [];

    for (const filter of node.filters) {
      if ("field" in filter) {
        if (filter.value.trim().length === 0) continue;
        filters.push(filter);
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

  return stripGroup(group) ?? createGroup();
}

function groupIsEmpty(group: TQueryGroup | null): boolean {
  if (!group) return true;
  return group.filters.length === 0 || group.filters.every((f) => "field" in f && f.op === "contains" && !f.value);
}

/** Add a label as a new "contains" rule to the root filter group. */
export function addLabelRule(group: TQueryGroup | null, label: string): TQueryGroup {
  const rule: TQueryRule = { field: "labels.value.id", op: "contains", value: label };
  if (groupIsEmpty(group)) return { op: "and", filters: [rule] };
  return { ...group, filters: [...group.filters, rule] };
}

/** Remove the first "contains" rule matching a label value from the filter tree. */
export function removeLabelRule(group: TQueryGroup, label: string): TQueryGroup | null {
  const newFilters: (TQueryGroup | TQueryRule)[] = [];
  let removed = false;

  for (const filter of group.filters) {
    if (!removed && "field" in filter && filter.op === "contains" && filter.value === label) {
      removed = true; // skip this rule
      continue;
    }
    if (!("field" in filter)) {
      const updated = removeLabelRule(filter, label);
      if (updated) newFilters.push(updated);
      else removed = true; // nested group became empty
    } else {
      newFilters.push(filter);
    }
  }

  if (newFilters.length === 0) return createGroup();
  return { ...group, filters: newFilters };
}
