import groupBy from "lodash/groupBy";

import { TFiltersGroup, TFiltersGroupConfig, TNestedSearchLabel } from "@/types";

export const groupSearchLabels = (nestedLabels: TNestedSearchLabel[], filterGroupsConfig: TFiltersGroupConfig[]): TFiltersGroup[] => {
  const groupedRootLabels = groupBy(nestedLabels, "type");

  return filterGroupsConfig.map((group) => {
    const includedRootLabels = [...group.rootLabelTypes]
      .sort()
      .map((type) => groupedRootLabels[type] || [])
      .flat();

    return { ...group, nestedLabels: includedRootLabels };
  });
};
