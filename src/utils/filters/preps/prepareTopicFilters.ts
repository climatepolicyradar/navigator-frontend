import sortBy from "lodash/sortBy";
import sortedUniqBy from "lodash/sortedUniqBy";

import { ID_SEPARATOR } from "@/constants/chars";
import { TFiltersGroupPrep } from "@/types";

const flattenTopicFilters: TFiltersGroupPrep = (rootLabels) => {
  return rootLabels.flatMap((label) => [{ ...label, children: [] }, ...flattenTopicFilters(label.children)]);
};

export const prepareTopicFilters =
  (conceptIds: string[]): TFiltersGroupPrep =>
  (rootLabels) => {
    const allTopics = sortedUniqBy(sortBy(flattenTopicFilters(rootLabels), "id"), "value");
    return allTopics.filter((topic) => !conceptIds.includes(topic.id.split(ID_SEPARATOR)[1]));
  };
