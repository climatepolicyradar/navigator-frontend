import sortBy from "lodash/sortBy";
import sortedUniqBy from "lodash/sortedUniqBy";

import { TNestedSearchLabel } from "@/types";

const flattenTopicFilters = (rootLabels: TNestedSearchLabel[]): TNestedSearchLabel[] => {
  return rootLabels.flatMap((label) => [{ ...label, children: [] }, ...flattenTopicFilters(label.children)]);
};

export const prepareTopicFilters = (rootLabels: TNestedSearchLabel[]): TNestedSearchLabel[] =>
  sortedUniqBy(sortBy(flattenTopicFilters(rootLabels), "id"), "value");
