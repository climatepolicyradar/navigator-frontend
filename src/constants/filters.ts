import { Earth, ListFilter } from "lucide-react";

import { TFiltersGroupConfig } from "@/types";
import { prepareGeographyFilters } from "@/utils/filters/prepareGeographyFilter";
import { prepareTopicFilters } from "@/utils/filters/prepareTopicFilters";

export const SEARCH_FILTER_GROUPS: TFiltersGroupConfig[] = [
  {
    title: "Filters",
    subtitle: "Choose themes and specific filters to refine your search",
    Icon: ListFilter,
    container: "drawer",
    rootLabelTypes: ["category"],
  },
  {
    title: "Geography",
    subtitle: "Publish location of main document",
    Icon: Earth,
    container: "drawer",
    rootLabelTypes: ["region"],
    prepareRootLabels: prepareGeographyFilters,
    filterParentsDefaultOpen: true,
  },
  {
    title: "Topic",
    container: "popover",
    afterPartition: true,
    rootLabelTypes: ["concept"],
    prepareRootLabels: prepareTopicFilters,
  },
];
