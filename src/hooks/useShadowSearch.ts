import { useState } from "react";

import { clausesToActiveFilters } from "@/components/_experiment/typeahead/AdvancedFilterQueryBuilder";
import { getSuggestedFilterMatches } from "@/components/_experiment/typeahead/SuggestedFilters";
import { TFilterClause, TFilterFieldOptions } from "@/types";
import {
  addToFilterKey,
  EMPTY_FILTERS,
  hasAnyFilters as checkHasAnyFilters,
  hasAnyMatches,
  hasRemainingSuggestions,
  SelectedFilters,
} from "@/utils/_experiment/suggestedFilterUtils";

export interface UseShadowSearchParams {
  filterOptions?: TFilterFieldOptions;
}

// Keys that support "add one" from suggested filters.
type TIncludedFilterKey = "topics" | "geos" | "years" | "documentTypes";

// Grouped return shape for easier review and testing.
export interface UseShadowSearchReturn {
  search: {
    term: string;
    setTerm: (value: string) => void;
    rawTerm: string;
    matches: ReturnType<typeof getSuggestedFilterMatches>;
    showStringOnlyResults: boolean;
  };
  filters: {
    value: SelectedFilters;
    hasAny: boolean;
    clearAll: () => void;
  };
  actions: {
    // Add one value to an included filter (e.g. from suggested filters).
    add: (key: TIncludedFilterKey, value: string) => void;
    // Remove one value from any filter key (included or excluded).
    remove: (key: keyof SelectedFilters, value: string) => void;
    applyAdvanced: (clauses: TFilterClause[]) => void;
    applyAll: (matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) => void;
    searchOnly: () => void;
    resetToOriginalSearch: () => void;
  };
}

/**
 * Encapsulates all state and behaviour for the shadow search (experimental search) page:
 * search input, raw query for results, string-only vs filter mode, and selected filters.
 */
export function useShadowSearch(params: UseShadowSearchParams = {}): UseShadowSearchReturn {
  const { filterOptions } = params;
  const [searchTerm, setSearchTerm] = useState("");
  const [rawSearchTerm, setRawSearchTerm] = useState("");
  const [wasStringOnlySearch, setWasStringOnlySearch] = useState(false);
  const [filters, setFilters] = useState<SelectedFilters>(EMPTY_FILTERS);

  const rawMatches = getSuggestedFilterMatches(rawSearchTerm, filterOptions);
  const hasAnyFiltersFlag = checkHasAnyFilters(filters);
  const showStringOnlyResults = !!rawSearchTerm && wasStringOnlySearch && !hasAnyFiltersFlag && hasAnyMatches(rawMatches);

  function clearAllFilters() {
    setFilters(EMPTY_FILTERS);
  }

  function applyRawSearch(trimmed: string) {
    if (trimmed.length > 0) setRawSearchTerm(trimmed);
    setWasStringOnlySearch(false);
  }

  function addToFilter(key: TIncludedFilterKey, value: string) {
    const trimmed = searchTerm.trim();
    const nextFilters = addToFilterKey(filters, key, value);
    setFilters(nextFilters);
    applyRawSearch(trimmed);
    if (!hasRemainingSuggestions(trimmed, nextFilters, filterOptions)) setSearchTerm("");
  }

  function handleApplyAll(matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) {
    setFilters({
      ...EMPTY_FILTERS,
      topics: matches.concepts,
      geos: matches.geos,
      years: matches.years,
      documentTypes: matches.documentTypes,
    });
    setRawSearchTerm(searchTerm);
    setWasStringOnlySearch(false);
    setSearchTerm("");
  }

  function applyAdvancedFilters(clauses: TFilterClause[]) {
    const active = clausesToActiveFilters(clauses);
    setFilters({
      topics: active.includedConcepts,
      geos: active.includedGeos,
      years: active.includedYears,
      documentTypes: active.includedDocumentTypes,
      topicsExcluded: active.excludedConcepts,
      geosExcluded: active.excludedGeos,
      yearsExcluded: active.excludedYears,
      documentTypesExcluded: active.excludedDocumentTypes,
    });
    setRawSearchTerm("");
    setWasStringOnlySearch(false);
    setSearchTerm("");
  }

  function handleSearchOnly() {
    setRawSearchTerm(searchTerm);
    setWasStringOnlySearch(true);
    setSearchTerm("");
  }

  function resetFiltersToOriginalSearch() {
    setSearchTerm(rawSearchTerm);
    clearAllFilters();
    setRawSearchTerm("");
  }

  function removeFilter(update: Partial<SelectedFilters>) {
    setFilters((prev) => {
      const next = { ...prev, ...update };
      if (!checkHasAnyFilters(next)) setSearchTerm("");
      return next;
    });
  }

  function removeFromFilter(key: keyof SelectedFilters, value: string) {
    const arr = filters[key];
    if (!Array.isArray(arr)) return;
    removeFilter({ [key]: arr.filter((x) => x !== value) } as Partial<SelectedFilters>);
  }

  return {
    search: {
      term: searchTerm,
      setTerm: setSearchTerm,
      rawTerm: rawSearchTerm,
      matches: rawMatches,
      showStringOnlyResults,
    },
    filters: {
      value: filters,
      hasAny: hasAnyFiltersFlag,
      clearAll: clearAllFilters,
    },
    actions: {
      add: addToFilter,
      remove: removeFromFilter,
      applyAdvanced: applyAdvancedFilters,
      applyAll: handleApplyAll,
      searchOnly: handleSearchOnly,
      resetToOriginalSearch: resetFiltersToOriginalSearch,
    },
  };
}

export default useShadowSearch;
