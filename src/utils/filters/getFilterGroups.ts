import { LucideEarth, LucideListFilter } from "lucide-react";

import { FilterHeaderTopics } from "@/components/fragments/filters/FilterHeaderTopics";
import { TFeatures, TFiltersGroupConfig, TTheme } from "@/types";
import { prepareGeographyFilters } from "@/utils/filters/prepareGeographyFilter";
import { prepareTopicFilters } from "@/utils/filters/prepareTopicFilters";

export const getFilterGroups = (theme: TTheme, features: TFeatures): TFiltersGroupConfig[] => {
  const filterGroups: TFiltersGroupConfig[] = [
    {
      container: "drawer",
      Icon: LucideListFilter,
      rootLabelTypes: ["category"],
      subtitle: "Choose themes and specific filters to refine your search",
      title: "Filters",
    },
    {
      container: "drawer",
      Icon: LucideEarth,
      prepareRootLabels: prepareGeographyFilters,
      rootLabelTypes: ["region"],
      subtitle: "Publish location of main document",
      title: "Geography",
      topLevelDefaultOpen: true,
    },
    {
      afterPartition: true,
      container: "popover",
      header: FilterHeaderTopics,
      prepareRootLabels: prepareTopicFilters,
      rootLabelTypes: ["concept"],
      title: "Topic",
      topLevelDefaultOpen: true,
    },
    {
      container: "datepicker",
      rootLabelTypes: [],
      title: "Date",
    },
  ];

  return filterGroups;
};
