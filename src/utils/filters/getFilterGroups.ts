import { LucideEarth, LucideListFilter } from "lucide-react";

import { FilterHeaderTopics } from "@/components/fragments/filters/FilterHeaderTopics";
import { TAppDictionaryKey } from "@/constants/text";
import { TFeatures, TFiltersGroupConfig, TTheme } from "@/types";
import { prepareGeographyFilters } from "@/utils/filters/prepareGeographyFilter";
import { prepareTopicFilters } from "@/utils/filters/prepareTopicFilters";

interface IProps {
  features: TFeatures;
  getAppText: (textKey: TAppDictionaryKey) => string;
  theme: TTheme;
}

export const getFilterGroups = ({ features, getAppText, theme }: IProps): TFiltersGroupConfig[] => {
  const filterGroups: TFiltersGroupConfig[] = [];

  // Filters
  filterGroups.push({
    container: "drawer",
    Icon: LucideListFilter,
    rootLabelTypes: ["category"],
    subtitle: "Choose themes and specific filters to refine your search",
    title: "Filters",
  });

  // Geography
  filterGroups.push({
    container: "drawer",
    Icon: LucideEarth,
    prepareRootLabels: prepareGeographyFilters,
    rootLabelTypes: ["region"],
    subtitle: "Publish location of main document",
    title: "Geography",
    topLevelDefaultOpen: true,
  });

  // Topics
  filterGroups.push({
    container: "popover",
    header: FilterHeaderTopics,
    prepareRootLabels: prepareTopicFilters,
    rootLabelTypes: ["concept"],
    title: "Topic",
    afterPartition: true,
    topLevelDefaultOpen: true,
  });

  // Date
  filterGroups.push({
    container: "datepicker",
    rootLabelTypes: [],
    title: getAppText("filterGroupDate"),
  });

  return filterGroups;
};
