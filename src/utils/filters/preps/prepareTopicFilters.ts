import sortBy from "lodash/sortBy";
import sortedUniqBy from "lodash/sortedUniqBy";

import { TFiltersGroupPrep } from "@/types";

const flattenTopicFilters: TFiltersGroupPrep = (rootLabels) => {
  return rootLabels.flatMap((label) => [{ ...label, children: [] }, ...flattenTopicFilters(label.children)]);
};

export const prepareTopicFilters: TFiltersGroupPrep = (rootLabels) => sortedUniqBy(sortBy(flattenTopicFilters(rootLabels), "id"), "value");
