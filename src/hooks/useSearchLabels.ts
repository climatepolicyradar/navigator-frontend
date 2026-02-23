import { useQuery } from "@tanstack/react-query";

import { useEnvConfig } from "@/context/EnvConfig";
import { fetchSearchLabels, type ISearchApiLabelsResponse } from "@/utils/_experiment/shadowSearchLabelsApi";

const SEARCH_LABELS_KEY = "shadow-search-labels";

/**
 * Fetches label options from GET /search/labels for shadow search filter dropdowns.
 * Only runs when CONCEPTS_API_URL is set and query has at least one character
 * (API requires min_length=1). Use the returned label titles when building
 * /search/documents filters so values match the index.
 *
 * @param query - Prefix to search labels by title (e.g. search term or "a" for bootstrap)
 * @param options - Optional { enabled } to override when the query runs
 */
export function useSearchLabels(query: string, options: { enabled?: boolean } = {}) {
  const { CONCEPTS_API_URL } = useEnvConfig();
  const apiBase = CONCEPTS_API_URL?.trim() ? CONCEPTS_API_URL : undefined;
  const trimmed = query.trim();
  const effectiveQuery = trimmed.length > 0 ? trimmed : "a";
  const defaultEnabled = Boolean(apiBase) && effectiveQuery.length >= 1;
  const enabled = options.enabled !== undefined ? options.enabled : defaultEnabled;

  return useQuery<ISearchApiLabelsResponse>({
    queryKey: [SEARCH_LABELS_KEY, apiBase, effectiveQuery],
    queryFn: async () => {
      if (!apiBase) {
        throw new Error("CONCEPTS_API_URL is not set");
      }
      return fetchSearchLabels(apiBase, effectiveQuery);
    },
    enabled: Boolean(apiBase) && enabled,
  });
}
