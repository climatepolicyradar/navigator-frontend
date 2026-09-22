import groupBy from "lodash/groupBy";

import { TFiltersGroupPrep } from "@/types";
import { createGroupLabel } from "@/utils/filters/createGroupLabel";

export const prepareCCCFilters: TFiltersGroupPrep = (rootLabels) => {
  const litigationCategory = rootLabels.find((label) => label.value === "Litigation");
  if (!litigationCategory) return [];

  const litigationLabelsByType = groupBy(litigationCategory.children, "type");

  // TODO PLACEHOLDER - add type order, naming, subtitles once data is available
  return Object.entries(litigationLabelsByType).map(([type, labels]) => createGroupLabel(type, labels));
};
