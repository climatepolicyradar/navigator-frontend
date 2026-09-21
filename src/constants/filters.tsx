import { ZeroStateSearchNoTopics } from "@/components/organisms/zeroStates/ZeroStateSearchNoTopics";
import { TFiltersGroupConfig } from "@/types";
import { prepareTopicFilters } from "@/utils/filters/prepareTopicFilters";

export const PASSAGE_FILTER_GROUPS: TFiltersGroupConfig[] = [
  {
    container: "popover",
    emptyStateRender: ZeroStateSearchNoTopics,
    prepareRootLabels: prepareTopicFilters,
    rootLabelTypes: ["concept"],
    title: "Topic",
  },
];
