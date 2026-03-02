import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";

import { ApiClient } from "@/api/http-common";

export type TLabelResult = {
  id: string;
  title: string;
  type: string;
};

type TLabelsResponse = {
  results: TLabelResult[];
};

interface UseLabelSearchOptions {
  /** Debounce delay in milliseconds @default 300 */
  debounceDelay?: number;
}

/**
 * Hook that searches the /search/labels API with debouncing.
 *
 * Returns the current results array and a loading flag.
 * The search is triggered reactively whenever `query` changes.
 *
 * @example
 * ```ts
 * const { results, isLoading } = useLabelSearch(inputValue);
 * ```
 */
export function useLabelSearch(query: string, options: UseLabelSearchOptions = {}) {
  const { debounceDelay = 300 } = options;

  const [results, setResults] = useState<TLabelResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (q: string) => {
        if (!q.trim()) {
          setResults([]);
          return;
        }

        setIsLoading(true);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org";
          const client = new ApiClient(apiUrl);
          const response = await client.get<TLabelsResponse>(`/search/labels?query=${encodeURIComponent(q)}`, null);
          setResults(response.data.results || []);
        } catch {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, debounceDelay),
    [debounceDelay]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  return { results, isLoading };
}
