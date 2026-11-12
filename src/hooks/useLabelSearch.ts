import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";

import { ApiClient } from "@/api/http-common";
import { useEnvConfig } from "@/context/EnvConfig";
import { TNestedSearchLabel, TSearchLabel, TSearchQueryGroup } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";

type TLabelsResponse = {
  results: TSearchLabel[];
};

type TTaxonomyResponse = {
  data: TNestedSearchLabel[];
};

interface ITaxonomyParams {
  patterns: string[];
  filters?: TSearchQueryGroup;
}

interface UseLabelSearchOptions {
  /** Debounce delay in milliseconds @default 300 */
  debounceDelay?: number;
}

export const loadLabels = async (apiUrl: string, query: string): Promise<TSearchLabel[]> => {
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
      {
        field: "type",
        op: "not_contains",
        value: "external_id",
      },
    ],
  };
  const response = await client.get<TLabelsResponse>(
    `/search/labels?query=${encodeURIComponent(query)}&page_size=10000&filters=${encodeURIComponent(JSON.stringify(defaultFilter))}`,
    null
  );
  return response.data.results || [];
};

export async function loadTaxonomy(apiUrl: string, { patterns, filters }: ITaxonomyParams): Promise<TNestedSearchLabel[]> {
  const client = new ApiClient(apiUrl);
  const searchParams = new URLSearchParams();
  patterns.forEach((pattern) => searchParams.append("include", pattern));
  if (filters) {
    searchParams.set("filters", deflateFilters(filters));
    searchParams.set("encoding", "deflate");
  }
  const response = await client.get<TTaxonomyResponse>(`/search/labels:taxonomy?${searchParams.toString()}`, null);
  return response.data.data || [];
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
  const { API_URL } = useEnvConfig();

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
          const response = await loadLabels(API_URL, q);
          setResults(response || []);
        } catch {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }, debounceDelay),
    [debounceDelay, API_URL]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  return { results, isLoading };
}
