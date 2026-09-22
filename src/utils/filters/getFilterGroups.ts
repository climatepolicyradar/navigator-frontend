import { LucideEarth, LucideListFilter } from "lucide-react";

import { FilterHeaderTopics } from "@/components/fragments/filters/FilterHeaderTopics";
import { TAppDictionaryKey } from "@/constants/text";
import { TFeatures, TFiltersGroupConfig, TFiltersGroupPrep, TTheme } from "@/types";
import {
  prepareCCCFilters,
  prepareCCLWFilters,
  prepareCPRFilters,
  prepareGeographyFilters,
  prepareMCFFilters,
  prepareTopicFilters,
} from "@/utils/filters/preps";

const FILTER_PREP_DICTIONARY: Record<TTheme, TFiltersGroupPrep | null> = {
  ccc: prepareCCCFilters,
  cclw: prepareCCLWFilters,
  cpr: prepareCPRFilters,
  mcf: prepareMCFFilters,
};

interface IProps {
  features: TFeatures;
  getAppText: (textKey: TAppDictionaryKey) => string;
  theme: TTheme;
}

// TODO use `features` for themes (nature project) [FUS-438]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getFilterGroups = ({ features, getAppText, theme }: IProps): TFiltersGroupConfig[] => {
  const filterGroups: TFiltersGroupConfig[] = [];

  // Filters
  filterGroups.push({
    container: "drawer",
    Icon: LucideListFilter,
    prepareRootLabels: FILTER_PREP_DICTIONARY[theme] || undefined,
    rootLabelTypes: ["category"],
    subtitle: "Choose themes and specific filters to refine your search",
    title: getAppText("filterGroupFilters"),
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
