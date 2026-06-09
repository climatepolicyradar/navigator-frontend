import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { TSearchLabel } from "@/types";

type TLabelsResponse = {
  results: TSearchLabel[];
};

interface UseLabelSearchOptions {
  /** Debounce delay in milliseconds @default 300 */
  debounceDelay?: number;
}

export const loadLabels = async (query: string): Promise<TSearchLabel[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.climatepolicyradar.org";
  const client = new ApiClient(apiUrl);
  // Exclude these types as it is legacy data, or not relevant to the search UI.
  const defaultFilter = {
    op: "and",
    filters: [
      {
        field: "type",
        op: "not_contains",
        value: "framework",
      },
      {
        field: "type",
        op: "not_contains",
        value: "keyword",
      },
      {
        field: "type",
        op: "not_contains",
        value: "hazard",
      },
      {
        field: "type",
        op: "not_contains",
        value: "keyword",
      },
      {
        field: "type",
        op: "not_contains",
        value: "instrument",
      },
      {
        field: "type",
        op: "not_contains",
        value: "theme",
      },
      {
        field: "type",
        op: "not_contains",
        value: "result_type",
      },
      {
        field: "type",
        op: "not_contains",
        value: "role",
      },
      {
        field: "type",
        op: "not_contains",
        value: "language",
      },
      {
        field: "type",
        op: "not_contains",
        value: "sector",
      },
      {
        field: "type",
        op: "not_contains",
        value: "deprecated_category",
      },
      {
        field: "type",
        op: "not_contains",
        value: "domain",
      },
      {
        field: "type",
        op: "not_contains",
        value: "process",
      },
    ],
  };
  const response = await client.get<TLabelsResponse>(
    `/search/labels?query=${encodeURIComponent(query)}&page_size=10000&filters=${encodeURIComponent(JSON.stringify(defaultFilter))}`,
    null
  );
  return response.data.results || [];
};

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

  const [results, setResults] = useState<TSearchLabel[]>([]);
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
          const response = await loadLabels(q);
          setResults(response || []);
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
