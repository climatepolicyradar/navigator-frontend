import { SearchHistoryItem } from "@/hooks/useSearchHistory";
import { TIncludedFilterKey } from "@/utils/_experiment/shadowSearchFilterConfig";
import { addToFilterKey, EMPTY_FILTERS, SelectedFilters } from "@/utils/_experiment/suggestedFilterUtils";

/**
 * Shadow search state: current input, committed "raw" term for results,
 * string-only mode flag, and selected filters.
 *
 * Search modes:
 * - "current input" (searchTerm): what the user is typing; not yet committed.
 * - "raw term" (rawSearchTerm): the query that results are shown for. Set when
 *    user clicks "Search only" (string-only) or when filters are applied (then
 *    raw term is the last string used, or empty if filters-only).
 * - showStringOnlyResults: true when we have a raw term, no filters, and the
 *    user chose "Search only" (wasStringOnlySearch). Results show string-only;
 *    suggested filters may be shown to refine.
 */
export interface ShadowSearchState {
  searchTerm: string;
  rawSearchTerm: string;
  wasStringOnlySearch: boolean;
  filters: SelectedFilters;
}

export const initialShadowSearchState: ShadowSearchState = {
  searchTerm: "",
  rawSearchTerm: "",
  wasStringOnlySearch: false,
  filters: EMPTY_FILTERS,
};

export type ShadowSearchAction =
  // User edits the search input (not yet committed).
  | { type: "SET_SEARCH_TERM"; payload: string }
  // Add a single included filter value (e.g. from suggestions or IntelliSearch).
  | { type: "ADD_FILTER"; payload: { key: TIncludedFilterKey; value: string } }
  // Remove a single value from any filter array; may also clear results when last filter goes.
  | { type: "REMOVE_FILTER"; payload: { key: keyof SelectedFilters; value: string } }
  // Replace all filters wholesale.
  | { type: "SET_FILTERS"; payload: SelectedFilters }
  // Convert current string matches into included filters only (no exclusions).
  | { type: "APPLY_ALL"; payload: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] } }
  // Apply advanced builder output (includes include + exclude filters).
  | { type: "APPLY_ADVANCED"; payload: SelectedFilters }
  // Commit current input as a string-only query (no filters).
  | { type: "SEARCH_ONLY" }
  // Restore the original raw query, dropping filters built from it.
  | { type: "RESET_TO_ORIGINAL" }
  // Drop all filters but leave search terms untouched.
  | { type: "CLEAR_FILTERS" }
  // Restore a previous search (term, raw term, filters, mode) from history.
  | { type: "APPLY_HISTORY_ITEM"; payload: SearchHistoryItem }
  // Restore full state from sessionStorage (client-only, after mount).
  | { type: "RESTORE"; payload: ShadowSearchState };

export function shadowSearchReducer(state: ShadowSearchState, action: ShadowSearchAction): ShadowSearchState {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };

    case "ADD_FILTER": {
      const filtersWithAddedValue = addToFilterKey(state.filters, action.payload.key, action.payload.value);
      return {
        ...state,
        filters: filtersWithAddedValue,
        rawSearchTerm: "",
        wasStringOnlySearch: false,
      };
    }

    case "REMOVE_FILTER": {
      const { key, value } = action.payload;
      const currentValuesForFilterKey = state.filters[key];
      if (!Array.isArray(currentValuesForFilterKey)) return state;
      const valuesAfterRemoval = currentValuesForFilterKey.filter((v) => v !== value);
      const nextFilters = { ...state.filters, [key]: valuesAfterRemoval };
      const hasNoFiltersLeft =
        nextFilters.topics.length === 0 &&
        nextFilters.geos.length === 0 &&
        nextFilters.years.length === 0 &&
        nextFilters.documentTypes.length === 0 &&
        nextFilters.topicsExcluded.length === 0 &&
        nextFilters.geosExcluded.length === 0 &&
        nextFilters.yearsExcluded.length === 0 &&
        nextFilters.documentTypesExcluded.length === 0;
      return {
        ...state,
        filters: nextFilters,
        ...(hasNoFiltersLeft ? { searchTerm: "", rawSearchTerm: "", wasStringOnlySearch: false } : {}),
      };
    }

    case "SET_FILTERS":
      return { ...state, filters: action.payload };

    case "APPLY_ALL":
      return {
        ...state,
        filters: {
          ...EMPTY_FILTERS,
          topics: action.payload.concepts,
          geos: action.payload.geos,
          years: action.payload.years,
          documentTypes: action.payload.documentTypes,
        },
        rawSearchTerm: "",
        wasStringOnlySearch: false,
        searchTerm: "",
      };

    case "APPLY_ADVANCED":
      return {
        ...state,
        filters: action.payload,
        rawSearchTerm: "",
        wasStringOnlySearch: false,
        searchTerm: "",
      };

    case "SEARCH_ONLY":
      return {
        ...state,
        rawSearchTerm: state.searchTerm,
        wasStringOnlySearch: true,
        searchTerm: "",
      };

    case "RESET_TO_ORIGINAL":
      return {
        ...state,
        searchTerm: state.rawSearchTerm,
        filters: EMPTY_FILTERS,
        rawSearchTerm: "",
      };

    case "CLEAR_FILTERS":
      return { ...state, filters: EMPTY_FILTERS };

    case "APPLY_HISTORY_ITEM": {
      const historyItem = action.payload;
      return {
        ...state,
        searchTerm: historyItem.term,
        rawSearchTerm: historyItem.term,
        filters: historyItem.filters ?? EMPTY_FILTERS,
        wasStringOnlySearch: historyItem.wasStringOnly ?? false,
      };
    }

    case "RESTORE":
      return { ...action.payload };

    default:
      return state;
  }
}
