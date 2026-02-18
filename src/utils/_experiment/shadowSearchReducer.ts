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
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "ADD_FILTER"; payload: { key: TIncludedFilterKey; value: string } }
  | { type: "REMOVE_FILTER"; payload: { key: keyof SelectedFilters; value: string } }
  | { type: "SET_FILTERS"; payload: SelectedFilters }
  | { type: "APPLY_ALL"; payload: { concepts: string[]; geos: string[]; years: string[]; documentTypes: string[] } }
  | { type: "APPLY_ADVANCED"; payload: SelectedFilters }
  | { type: "SEARCH_ONLY" }
  | { type: "RESET_TO_ORIGINAL" }
  | { type: "CLEAR_FILTERS" }
  | { type: "APPLY_HISTORY_ITEM"; payload: SearchHistoryItem };

export function shadowSearchReducer(state: ShadowSearchState, action: ShadowSearchAction): ShadowSearchState {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };

    case "ADD_FILTER": {
      const next = addToFilterKey(state.filters, action.payload.key, action.payload.value);
      return {
        ...state,
        filters: next,
        rawSearchTerm: "",
        wasStringOnlySearch: false,
      };
    }

    case "REMOVE_FILTER": {
      const { key, value } = action.payload;
      const arr = state.filters[key];
      if (!Array.isArray(arr)) return state;
      const nextArr = arr.filter((x) => x !== value);
      const nextFilters = { ...state.filters, [key]: nextArr };
      const clearSearch =
        !nextFilters.topics.length &&
        !nextFilters.geos.length &&
        !nextFilters.years.length &&
        !nextFilters.documentTypes.length &&
        !nextFilters.topicsExcluded.length &&
        !nextFilters.geosExcluded.length &&
        !nextFilters.yearsExcluded.length &&
        !nextFilters.documentTypesExcluded.length;
      return {
        ...state,
        filters: nextFilters,
        ...(clearSearch ? { searchTerm: "", rawSearchTerm: "", wasStringOnlySearch: false } : {}),
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
      const item = action.payload;
      return {
        ...state,
        searchTerm: item.term,
        rawSearchTerm: item.term,
        filters: item.filters ?? EMPTY_FILTERS,
        wasStringOnlySearch: item.wasStringOnly ?? false,
      };
    }

    default:
      return state;
  }
}
