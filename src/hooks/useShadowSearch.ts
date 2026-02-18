import { useState } from "react";

import { clausesToActiveFilters } from "@/components/_experiment/typeahead/AdvancedFilterQueryBuilder";
import { getSuggestedFilterMatches } from "@/components/_experiment/typeahead/SuggestedFilters";
import { useSearchHistory, SearchHistoryItem } from "@/hooks/useSearchHistory";
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
  searchHistory: {
    history: SearchHistoryItem[];
    clearHistory: () => void;
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
    // Restore search term and filters from a history item.
    applyHistoryItem: (item: SearchHistoryItem) => void;
  };
}

/**
 * Encapsulates all state and behaviour for the shadow search (experimental search) page:
 * search input, raw query for results, string-only vs filter mode, and selected filters.
 */
export function useShadowSearch(params: UseShadowSearchParams = {}): UseShadowSearchReturn {
  const { filterOptions } = params;
  const { history: searchHistoryList, addToHistory, clearHistory } = useSearchHistory();
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

  function addToFilter(key: TIncludedFilterKey, value: string) {
    const trimmed = searchTerm.trim();
    const nextFilters = addToFilterKey(filters, key, value);
    addToHistory(trimmed, { filters: nextFilters });
    setFilters((prev) => {
      const next = addToFilterKey(prev, key, value);
      if (!hasRemainingSuggestions(trimmed, next, filterOptions)) {
        setTimeout(() => setSearchTerm(""), 0);
      }
      return next;
    });
    setRawSearchTerm("");
    setWasStringOnlySearch(false);
  }

  function handleApplyAll(matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) {
    const trimmed = searchTerm.trim();
    const nextFilters: SelectedFilters = {
      ...EMPTY_FILTERS,
      topics: matches.concepts,
      geos: matches.geos,
      years: matches.years,
      documentTypes: matches.documentTypes,
    };
    if (trimmed.length > 0) addToHistory(trimmed, { filters: nextFilters });
    setFilters(nextFilters);
    setRawSearchTerm("");
    setWasStringOnlySearch(false);
    setSearchTerm("");
  }

  function applyAdvancedFilters(clauses: TFilterClause[]) {
    const active = clausesToActiveFilters(clauses);
    const nextFilters: SelectedFilters = {
      topics: active.includedConcepts,
      geos: active.includedGeos,
      years: active.includedYears,
      documentTypes: active.includedDocumentTypes,
      topicsExcluded: active.excludedConcepts,
      geosExcluded: active.excludedGeos,
      yearsExcluded: active.excludedYears,
      documentTypesExcluded: active.excludedDocumentTypes,
    };
    const label = rawSearchTerm.trim() || "Advanced filters";
    addToHistory(label, { filters: nextFilters });
    setFilters(nextFilters);
    setRawSearchTerm("");
    setWasStringOnlySearch(false);
    setSearchTerm("");
  }

  function handleSearchOnly() {
    const trimmed = searchTerm.trim();
    if (trimmed.length > 0) addToHistory(trimmed, { wasStringOnly: true });
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
      if (!checkHasAnyFilters(next)) {
        // No filters left: clear both the search input and any previous results.
        setSearchTerm("");
        setRawSearchTerm("");
        setWasStringOnlySearch(false);
      }
      return next;
    });
  }

  function removeFromFilter(key: keyof SelectedFilters, value: string) {
    const arr = filters[key];
    if (!Array.isArray(arr)) return;
    removeFilter({ [key]: arr.filter((x) => x !== value) } as Partial<SelectedFilters>);
  }

  function applyHistoryItem(item: SearchHistoryItem) {
    setSearchTerm(item.term);
    setRawSearchTerm(item.term);
    setFilters(item.filters ?? EMPTY_FILTERS);
    setWasStringOnlySearch(item.wasStringOnly ?? false);
  }

  return {
    search: {
      term: searchTerm,
      setTerm: setSearchTerm,
      rawTerm: rawSearchTerm,
      matches: rawMatches,
      showStringOnlyResults,
    },
    searchHistory: {
      history: searchHistoryList,
      clearHistory,
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
      applyHistoryItem,
    },
  };
}

export default useShadowSearch;
