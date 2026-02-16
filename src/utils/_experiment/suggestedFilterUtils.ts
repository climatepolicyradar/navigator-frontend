import { getSuggestedFilterMatches, TSuggestedFilterMatches } from "@/components/_experiment/typeahead/SuggestedFilters";
import { TFilterFieldOptions } from "@/types";

/** Keys that are array-valued and support add-one. */
type TIncludedFilterKey = "topics" | "geos" | "years" | "documentTypes";

// Single object holding all selected filter arrays (included and excluded).
export type SelectedFilters = {
  topics: string[];
  geos: string[];
  years: string[];
  documentTypes: string[];
  topicsExcluded: string[];
  geosExcluded: string[];
  yearsExcluded: string[];
  documentTypesExcluded: string[];
};

export const EMPTY_FILTERS: SelectedFilters = {
  topics: [],
  geos: [],
  years: [],
  documentTypes: [],
  topicsExcluded: [],
  geosExcluded: [],
  yearsExcluded: [],
  documentTypesExcluded: [],
};

// True if any included or excluded filter is set.
export function hasAnyFilters(filters: SelectedFilters): boolean {
  return (
    filters.topics.length > 0 ||
    filters.geos.length > 0 ||
    filters.years.length > 0 ||
    filters.documentTypes.length > 0 ||
    filters.topicsExcluded.length > 0 ||
    filters.geosExcluded.length > 0 ||
    filters.yearsExcluded.length > 0 ||
    filters.documentTypesExcluded.length > 0
  );
}

// True if the search string has at least one match in any category.
export function hasAnyMatches(matches: TSuggestedFilterMatches): boolean {
  return (
    matches.matchedConcepts.length > 0 || matches.matchedGeos.length > 0 || matches.matchedYears.length > 0 || matches.matchedDocumentTypes.length > 0
  );
}

/**
 * True if for the given search string there are still suggested filters
 * that are not yet in the selected filters (i.e. user can add more).
 * Pass filterOptions when using real data so matching uses the same lists.
 */
export function hasRemainingSuggestions(search: string, filters: SelectedFilters, filterOptions?: TFilterFieldOptions): boolean {
  const trimmed = search.trim();
  if (!trimmed) return false;
  const matches = getSuggestedFilterMatches(trimmed, filterOptions);
  const remainingConcepts = matches.matchedConcepts.filter((c) => !filters.topics.includes(c));
  const remainingGeos = matches.matchedGeos.filter((g) => !filters.geos.includes(g));
  const remainingYears = matches.matchedYears.filter((y) => !filters.years.includes(y));
  const remainingDocumentTypes = matches.matchedDocumentTypes.filter((d) => !filters.documentTypes.includes(d));
  return remainingConcepts.length > 0 || remainingGeos.length > 0 || remainingYears.length > 0 || remainingDocumentTypes.length > 0;
}

/** New filters with one value appended to the given included key. Used by all four handleSelect* handlers. */
export function addToFilterKey(filters: SelectedFilters, key: TIncludedFilterKey, value: string): SelectedFilters {
  const arr = filters[key];
  return { ...filters, [key]: [...arr, value] };
}
