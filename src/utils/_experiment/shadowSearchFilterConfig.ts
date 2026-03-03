import type { SelectedFilters } from "@/utils/_experiment/suggestedFilterUtils";

/**
 * Single source of truth for shadow search filter dimensions: keys, labels, and grouping.
 * Used by ActiveFiltersSidebar and to derive selected/add props for typeahead components.
 */
export const SHADOW_SEARCH_FILTER_DIMENSIONS = {
  included: [
    { key: "topics" as const, label: "Topics" },
    { key: "geos" as const, label: "Geographies" },
    { key: "years" as const, label: "Years" },
    { key: "documentTypes" as const, label: "Document types" },
  ],
  excluded: [
    { key: "topicsExcluded" as const, label: "Topics" },
    { key: "geosExcluded" as const, label: "Geographies" },
    { key: "yearsExcluded" as const, label: "Years" },
    { key: "documentTypesExcluded" as const, label: "Document types" },
  ],
} as const;

export type TIncludedFilterKey = (typeof SHADOW_SEARCH_FILTER_DIMENSIONS.included)[number]["key"];
export type TExcludedFilterKey = (typeof SHADOW_SEARCH_FILTER_DIMENSIONS.excluded)[number]["key"];
export type TFilterKey = keyof SelectedFilters;
