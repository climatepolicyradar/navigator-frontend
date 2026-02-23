import { useReducer } from "react";

import { useSearchHistory, SearchHistoryItem } from "@/hooks/useSearchHistory";
import { TFilterClause, TFilterFieldOptions } from "@/types";
import { clausesToActiveFilters } from "@/utils/_experiment/filterQueryBuilderUtils";
import { TIncludedFilterKey } from "@/utils/_experiment/shadowSearchFilterConfig";
import { initialShadowSearchState, shadowSearchReducer } from "@/utils/_experiment/shadowSearchReducer";
import { getSuggestedFilterMatches } from "@/utils/_experiment/suggestedFilterMatching";
import {
  addToFilterKey,
  hasAnyFilters as checkHasAnyFilters,
  hasRemainingSuggestions,
  TSelectedFilters,
} from "@/utils/_experiment/suggestedFilterUtils";

export interface UseShadowSearchParams {
  filterOptions?: TFilterFieldOptions;
}

/**
 * Grouped return shape for easier review and testing.
 */
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
    value: TSelectedFilters;
    hasAny: boolean;
    clearAll: () => void;
  };
  actions: {
    add: (key: TIncludedFilterKey, value: string) => void;
    remove: (key: keyof TSelectedFilters, value: string) => void;
    applyAdvanced: (clauses: TFilterClause[]) => void;
    applyAll: (matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) => void;
    searchOnly: () => void;
    resetToOriginalSearch: () => void;
    applyHistoryItem: (item: SearchHistoryItem) => void;
  };
}

/**
 * Encapsulates all state and behaviour for the shadow search (experimental search) page.
 * State is handled by shadowSearchReducer; see initialShadowSearchState for the
 * "search modes" (current input vs raw term vs string-only).
 */
export function useShadowSearch(params: UseShadowSearchParams = {}): UseShadowSearchReturn {
  const { filterOptions } = params;
  const [state, dispatch] = useReducer(shadowSearchReducer, initialShadowSearchState);
  const { history: recentSearchHistory, addToHistory, clearHistory } = useSearchHistory();

  const suggestedMatchesForRawTerm = getSuggestedFilterMatches(state.rawSearchTerm, filterOptions);
  const hasAnyFilters = checkHasAnyFilters(state.filters);
  const showStringOnlyResults = !!state.rawSearchTerm && state.wasStringOnlySearch && !hasAnyFilters;

  function addToFilter(key: TIncludedFilterKey, value: string) {
    const trimmedSearchTerm = state.searchTerm.trim();
    const filtersWithAddedValue = addToFilterKey(state.filters, key, value);
    addToHistory(trimmedSearchTerm, { filters: filtersWithAddedValue });
    dispatch({ type: "ADD_FILTER", payload: { key, value } });
    if (!hasRemainingSuggestions(trimmedSearchTerm, filtersWithAddedValue, filterOptions)) {
      setTimeout(() => dispatch({ type: "SET_SEARCH_TERM", payload: "" }), 0);
    }
  }

  function applyAllSuggestedFilters(matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) {
    const trimmedSearchTerm = state.searchTerm.trim();
    if (trimmedSearchTerm.length > 0) {
      addToHistory(trimmedSearchTerm, {
        filters: {
          topics: matches.concepts,
          geos: matches.geos,
          years: matches.years,
          documentTypes: matches.documentTypes,
          topicsExcluded: [],
          geosExcluded: [],
          yearsExcluded: [],
          documentTypesExcluded: [],
        },
      });
    }
    dispatch({ type: "APPLY_ALL", payload: matches });
  }

  function applyAdvancedFilters(clauses: TFilterClause[]) {
    const activeFiltersFromBuilder = clausesToActiveFilters(clauses);
    const selectedFiltersFromAdvanced: TSelectedFilters = {
      topics: activeFiltersFromBuilder.includedConcepts,
      geos: activeFiltersFromBuilder.includedGeos,
      years: activeFiltersFromBuilder.includedYears,
      documentTypes: activeFiltersFromBuilder.includedDocumentTypes,
      topicsExcluded: activeFiltersFromBuilder.excludedConcepts,
      geosExcluded: activeFiltersFromBuilder.excludedGeos,
      yearsExcluded: activeFiltersFromBuilder.excludedYears,
      documentTypesExcluded: activeFiltersFromBuilder.excludedDocumentTypes,
    };
    const historyLabel = state.rawSearchTerm.trim() || "Advanced filters";
    addToHistory(historyLabel, { filters: selectedFiltersFromAdvanced });
    dispatch({ type: "APPLY_ADVANCED", payload: selectedFiltersFromAdvanced });
  }

  function commitSearchAsStringOnly() {
    const trimmedSearchTerm = state.searchTerm.trim();
    if (trimmedSearchTerm.length > 0) {
      addToHistory(trimmedSearchTerm, { wasStringOnly: true });
    }
    dispatch({ type: "SEARCH_ONLY" });
  }

  function resetToOriginalSearch() {
    dispatch({ type: "RESET_TO_ORIGINAL" });
  }

  function removeFilterValue(key: keyof TSelectedFilters, value: string) {
    const currentValues = state.filters[key];
    if (!Array.isArray(currentValues)) return;
    dispatch({ type: "REMOVE_FILTER", payload: { key, value } });
  }

  function applyHistoryItem(item: SearchHistoryItem) {
    dispatch({ type: "APPLY_HISTORY_ITEM", payload: item });
  }

  return {
    search: {
      term: state.searchTerm,
      setTerm: (value: string) => dispatch({ type: "SET_SEARCH_TERM", payload: value }),
      rawTerm: state.rawSearchTerm,
      matches: suggestedMatchesForRawTerm,
      showStringOnlyResults,
    },
    searchHistory: {
      history: recentSearchHistory,
      clearHistory,
    },
    filters: {
      value: state.filters,
      hasAny: hasAnyFilters,
      clearAll: () => dispatch({ type: "CLEAR_FILTERS" }),
    },
    actions: {
      add: addToFilter,
      remove: removeFilterValue,
      applyAdvanced: applyAdvancedFilters,
      applyAll: applyAllSuggestedFilters,
      searchOnly: commitSearchAsStringOnly,
      resetToOriginalSearch,
      applyHistoryItem,
    },
  };
}

export default useShadowSearch;
