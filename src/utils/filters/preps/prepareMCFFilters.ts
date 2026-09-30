import groupBy from "lodash/groupBy";

import themeConfig from "@/mcf/config";
import { TFiltersGroupPrep } from "@/types";
import { createGroupLabel } from "@/utils/filters/createGroupLabel";
import { filterLabelCategories } from "@/utils/filters/preps/filterLabelCategories";

export const prepareMCFFilters: TFiltersGroupPrep = (rootLabels) => {
  const mcfCategory = filterLabelCategories(rootLabels, themeConfig)[0];
  if (!mcfCategory) return [];

  const mcfLabelsByType = groupBy(mcfCategory.children, "type");

  return [createGroupLabel("entity_type", mcfLabelsByType.entity_type ?? []), createGroupLabel("agent", mcfLabelsByType.agent ?? [])];
};
