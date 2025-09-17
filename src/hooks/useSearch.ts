import { useEffect, useState, useMemo } from "react";

import buildSearchQuery, { TRouterQuery } from "@/utils/buildSearchQuery";
import { getCachedSearch, updateCacheSearch, TCacheResult } from "@/utils/searchCache";

import useGetThemeConfig from "./useThemeConfig";
import { ApiClient, getEnvFromServer } from "../api/http-common";
import { initialSearchCriteria } from "../constants/searchCriteria";
import { TMatchedFamily, TSearch, TLoadingStatus } from "../types";

const CACHE_ENABLED = false;

type TConfig = {
  headers: {
    accept: string;
    "Content-Type": string;
  };
  signal: AbortSignal;
};

async function getSearch(query = initialSearchCriteria, signal: AbortSignal) {
  const config: TConfig = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    signal,
  };

  const url = "/searches";
  const { data } = await getEnvFromServer();
  const client = new ApiClient(data?.env?.api_url, data?.env?.app_token);
  const results = await client.post<TSearch>(url, query, config);
  return results;
}

const useSearch = (query: TRouterQuery, familyId = "", documentId = "", runFreshSearch: boolean = true, noOfPassagesPerDoc: number = undefined) => {
  const { themeConfig } = useGetThemeConfig();
  const [status, setStatus] = useState<TLoadingStatus>("idle");
  const [families, setFamilies] = useState<TMatchedFamily[]>([]);
  const [hits, setHits] = useState<number>(null);
  const [continuationToken, setContinuationToken] = useState<string | null>(null);

  const searchQuery = useMemo(() => {
    return buildSearchQuery({ ...query }, themeConfig, familyId, documentId, undefined, noOfPassagesPerDoc);
  }, [query, themeConfig, familyId, documentId, noOfPassagesPerDoc]);

  useEffect(() => {
    setStatus("loading");

    // When this useEffect execution is unmounted, send a signal to the Axios request to abort the API request mid-flight
    const controller = new AbortController();

    // If we don't want to trigger an API call, return early
    if (!runFreshSearch || !searchQuery.runSearch) {
      setStatus("success");
      return;
    }

    const cacheId = {
      concept_filters: searchQuery.concept_filters,
      continuation_tokens: searchQuery.continuation_tokens,
      corpus_import_ids: searchQuery.corpus_import_ids,
      document_ids: searchQuery.document_ids,
      exact_match: searchQuery.exact_match,
      family_ids: searchQuery.family_ids,
      keyword_filters: searchQuery.keyword_filters,
      metadata: searchQuery.metadata,
      offset: searchQuery.offset,
      query_string: searchQuery.query_string,
      sort_field: searchQuery.sort_field,
      sort_order: searchQuery.sort_order,
      sort_within_page: searchQuery.sort_within_page,
      year_range: searchQuery.year_range,
    };

    // Check if we have a cached result before calling the API
    if (CACHE_ENABLED) {
      // Skip cache if we are running a search from a family or document page
      const cachedResult = cacheId.family_ids?.length || cacheId.document_ids?.length ? null : getCachedSearch(cacheId);

      if (cachedResult) {
        // Set the search results from the cache
        setFamilies(cachedResult?.families || []);
        setHits(cachedResult.hits);
        setContinuationToken(cachedResult.continuation_token || null);
        setStatus("success");
        return;
      }
    }

    const resultsQuery = getSearch(searchQuery, controller.signal);

    resultsQuery.then((res) => {
      // If the request is aborted due to unmounting, res is undefined
      if (typeof res === "object") {
        if (res.status === 200) {
          // Catch missing attributes from the API response
          setFamilies(res.data.families || []);
          setHits(res.data.total_family_hits || 0);
          setContinuationToken(res.data.continuation_token || null);

          if (CACHE_ENABLED) {
            const searchToCache: TCacheResult = {
              ...cacheId,
              families: res.data.families,
              hits: res.data.total_family_hits,
              continuation_token: res.data.continuation_token,
              timestamp: new Date().getTime(),
            };
            updateCacheSearch(searchToCache);
          }
        } else {
          setFamilies([]);
          setHits(0);
          setContinuationToken(null);
          setStatus("error");
        }
        setStatus("success");
      }
    });

    return () => {
      controller.abort();
    };
  }, [searchQuery, runFreshSearch]);

  return { status, families, hits, continuationToken, searchQuery };
};

export default useSearch;
