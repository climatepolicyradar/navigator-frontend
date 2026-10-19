import { LucideBook, LucideEarth, LucideListFilter } from "lucide-react";

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

const EXCLUDED_TOPICS_DICTIONARY: Record<TTheme, string[]> = {
  ccc: ["Q1277", "Q32", "Q911", "Q912"],
  cclw: [],
  cpr: ["Q1277", "Q32", "Q911", "Q912"],
  mcf: [],
};

/**
 * Domains map to "Climate" / "Nature" currently and these only make sense for CPR.
 * This may widen if we add more domains hence this set.
 */
const THEMES_WITH_DOMAINS: Set<TTheme> = new Set(["cpr"]);

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
    prepareRootLabels: FILTER_PREP_DICTIONARY[theme] || undefined,
    rootLabelTypes: ["category"],
    subtitle: features.themes
      ? "Search by document type. Expand for more specific filters."
      : "Choose themes and specific filters to refine your search",
    title: features.themes ? "Category" : getAppText("filterGroupFilters"),
  });

  if (features.themes && THEMES_WITH_DOMAINS.has(theme)) {
    // Theme
    filterGroups.push({
      title: "Theme",
      subtitle: "Refine your search by core policy area",
      Icon: LucideBook,
      container: "drawer",
      rootLabelTypes: ["domain"],
    });
  }

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
    prepareRootLabels: prepareTopicFilters(EXCLUDED_TOPICS_DICTIONARY[theme]),
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
