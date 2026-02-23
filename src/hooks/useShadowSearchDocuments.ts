import { useQuery } from "@tanstack/react-query";

import { useEnvConfig } from "@/context/EnvConfig";
import {
  fetchSearchDocuments,
  selectedFiltersToSearchApiFilters,
  type ISearchApiDocumentsResponse,
} from "@/utils/_experiment/shadowSearchDocumentsApi";
import { TSelectedFilters } from "@/utils/_experiment/suggestedFilterUtils";

const SEARCH_API_BASE_KEY = "shadow-search-documents";

/**
 * Fetches document search results from the search API at
 * {API_URL}/search/documents using the current shadow search term
 * and advanced filters. Only runs when there is a committed query or at least one filter.
 */
export function useShadowSearchDocuments(
  rawSearchTerm: string,
  filters: TSelectedFilters,
  hasAnyFilters: boolean,
  options: { limit?: number; offset?: number } = {}
) {
  const { CONCEPTS_API_URL } = useEnvConfig();
  const { limit = 20, offset = 0 } = options;
  const apiBase = CONCEPTS_API_URL?.trim() ? CONCEPTS_API_URL : undefined;
  const filtersJson = selectedFiltersToSearchApiFilters(filters);

  const filtersKey = filtersJson ?? "";
  return useQuery<ISearchApiDocumentsResponse>({
    queryKey: [SEARCH_API_BASE_KEY, rawSearchTerm, filtersKey, limit, offset],
    queryFn: async () => {
      if (!apiBase) {
        throw new Error("CONCEPTS_API_URL is not set");
      }
      return fetchSearchDocuments(apiBase, {
        query: rawSearchTerm || undefined,
        filters: filtersJson ?? undefined,
        limit,
        offset,
      });
    },
    enabled: Boolean(apiBase) && (rawSearchTerm.trim() !== "" || hasAnyFilters),
  });
}
