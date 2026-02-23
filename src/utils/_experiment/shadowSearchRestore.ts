import type { ShadowSearchState } from "@/utils/_experiment/shadowSearchReducer";
import { EMPTY_FILTERS, hasAnyFilters, type SelectedFilters } from "@/utils/_experiment/suggestedFilterUtils";

const SESSION_STORAGE_KEY = "navigator-shadow-search-restore";

function isSelectedFilters(value: unknown): value is SelectedFilters {
  if (!value || typeof value !== "object") return false;
  const keys: (keyof SelectedFilters)[] = [
    "topics",
    "geos",
    "years",
    "documentTypes",
    "topicsExcluded",
    "geosExcluded",
    "yearsExcluded",
    "documentTypesExcluded",
  ];
  for (const key of keys) {
    if (!Array.isArray((value as Record<string, unknown>)[key])) return false;
  }
  return true;
}

/**
 * Reads persisted shadow search state from sessionStorage so that when the user
 * returns to the search page (e.g. back from a result), we can show the same results.
 */
export function getRestoredShadowSearchState(): ShadowSearchState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const o = parsed as Record<string, unknown>;
    const searchTerm = typeof o.searchTerm === "string" ? o.searchTerm : "";
    const rawSearchTerm = typeof o.rawSearchTerm === "string" ? o.rawSearchTerm : "";
    const wasStringOnlySearch = typeof o.wasStringOnlySearch === "boolean" ? o.wasStringOnlySearch : false;
    const filters = isSelectedFilters(o.filters) ? o.filters : EMPTY_FILTERS;
    return {
      searchTerm,
      rawSearchTerm,
      wasStringOnlySearch,
      filters,
    };
  } catch {
    return null;
  }
}

/**
 * Persists shadow search state to sessionStorage when there are results to show,
 * so that returning to the search page restores the view.
 */
export function saveShadowSearchStateForRestore(state: ShadowSearchState): void {
  if (typeof window === "undefined") return;
  try {
    if (state.rawSearchTerm === "" && !hasAnyFilters(state.filters)) return;
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore.
  }
}
