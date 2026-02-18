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
  SelectedFilters,
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
    value: SelectedFilters;
    hasAny: boolean;
    clearAll: () => void;
  };
  actions: {
    add: (key: TIncludedFilterKey, value: string) => void;
    remove: (key: keyof SelectedFilters, value: string) => void;
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
  const { history: searchHistoryList, addToHistory, clearHistory } = useSearchHistory();

  const rawMatches = getSuggestedFilterMatches(state.rawSearchTerm, filterOptions);
  const hasAnyFiltersFlag = checkHasAnyFilters(state.filters);
  const showStringOnlyResults = !!state.rawSearchTerm && state.wasStringOnlySearch && !hasAnyFiltersFlag;

  function addToFilter(key: TIncludedFilterKey, value: string) {
    const trimmed = state.searchTerm.trim();
    const nextFilters = addToFilterKey(state.filters, key, value);
    addToHistory(trimmed, { filters: nextFilters });
    dispatch({ type: "ADD_FILTER", payload: { key, value } });
    if (!hasRemainingSuggestions(trimmed, nextFilters, filterOptions)) {
      setTimeout(() => dispatch({ type: "SET_SEARCH_TERM", payload: "" }), 0);
    }
  }

  function handleApplyAll(matches: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] }) {
    const trimmed = state.searchTerm.trim();
    if (trimmed.length > 0) {
      addToHistory(trimmed, {
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
    const label = state.rawSearchTerm.trim() || "Advanced filters";
    addToHistory(label, { filters: nextFilters });
    dispatch({ type: "APPLY_ADVANCED", payload: nextFilters });
  }

  function handleSearchOnly() {
    const trimmed = state.searchTerm.trim();
    if (trimmed.length > 0) addToHistory(trimmed, { wasStringOnly: true });
    dispatch({ type: "SEARCH_ONLY" });
  }

  function resetFiltersToOriginalSearch() {
    dispatch({ type: "RESET_TO_ORIGINAL" });
  }

  function removeFromFilter(key: keyof SelectedFilters, value: string) {
    const arr = state.filters[key];
    if (!Array.isArray(arr)) return;
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
      matches: rawMatches,
      showStringOnlyResults,
    },
    searchHistory: {
      history: searchHistoryList,
      clearHistory,
    },
    filters: {
      value: state.filters,
      hasAny: hasAnyFiltersFlag,
      clearAll: () => dispatch({ type: "CLEAR_FILTERS" }),
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
