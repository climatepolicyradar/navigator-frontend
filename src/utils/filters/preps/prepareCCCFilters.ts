import groupBy from "lodash/groupBy";

import themeConfig from "@/ccc/config";
import { TFiltersGroupPrep } from "@/types";
import { createGroupLabel } from "@/utils/filters/createGroupLabel";
import { filterLabelCategories } from "@/utils/filters/preps/filterLabelCategories";

export const prepareCCCFilters: TFiltersGroupPrep = (rootLabels) => {
  const litigationCategory = filterLabelCategories(rootLabels, themeConfig)[0];
  if (!litigationCategory) return [];

  const litigationLabelsByType = groupBy(litigationCategory.children, "type");

  // TODO PLACEHOLDER - add type order, naming, subtitles once data is available [FUS-519]
  return Object.entries(litigationLabelsByType).map(([type, labels]) => createGroupLabel(type, labels));
};
