import { EmptyTopicsFilter } from "@/components/atoms/misc/EmptyTopicsFilter";
import { TFiltersGroupConfig } from "@/types";
import { prepareTopicFilters } from "@/utils/filters/prepareTopicFilters";

export const PASSAGE_FILTER_GROUPS: TFiltersGroupConfig[] = [
  {
    container: "popover",
    emptyStateRender: EmptyTopicsFilter,
    prepareRootLabels: prepareTopicFilters,
    rootLabelTypes: ["concept"],
    title: "Topic",
  },
];
