import groupBy from "lodash/groupBy";

import { TFiltersGroupPrep } from "@/types";
import { createGroupLabel } from "@/utils/filters/createGroupLabel";

export const prepareMCFFilters: TFiltersGroupPrep = (rootLabels) => {
  const mcfCategory = rootLabels[0];
  if (!mcfCategory) return [];

  const mcfLabelsByType = groupBy(mcfCategory.children, "type");

  return [createGroupLabel("entity_type", mcfLabelsByType.entity_type ?? []), createGroupLabel("agent", mcfLabelsByType.agent ?? [])];
};
