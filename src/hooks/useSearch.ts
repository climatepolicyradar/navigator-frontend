import { useEffect, useState, useMemo } from "react";
import { ApiClient } from "../api/http-common";
import { config } from "../config";

import useGetThemeConfig from "./useThemeConfig";

import buildSearchQuery, { TRouterQuery } from "@/utils/buildSearchQuery";
import { getCachedSearch, updateCacheSearch, TCacheResult } from "@/utils/searchCache";

import { initialSearchCriteria } from "../constants/searchCriteria";

import { TMatchedFamily, TSearch, TLoadingStatus } from "../types";

const CACHE_ENABLED = false;

type TConfig = {
  headers: {
    accept: string;
    "Content-Type": string;
  };
};

const scrollToSearchTop = () => {
  const container = document.querySelector("#search");
  container?.scrollIntoView(true);
};

async function getSearch(query = initialSearchCriteria) {
  const url = "/searches";
  const client = new ApiClient(config.apiUrl, config.appToken);
  const results = await client.post<TSearch>(url, query, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  });
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
    scrollToSearchTop();

    // If we don't want to trigger an API call, return early
    if (!runFreshSearch || !searchQuery.runSearch) {
      setStatus("success");
      return;
    }

    const cacheId = {
      query_string: searchQuery.query_string,
      exact_match: searchQuery.exact_match,
      keyword_filters: searchQuery.keyword_filters,
      year_range: searchQuery.year_range,
      sort_field: searchQuery.sort_field,
      sort_order: searchQuery.sort_order,
      offset: searchQuery.offset,
      family_ids: searchQuery.family_ids,
      document_ids: searchQuery.document_ids,
      continuation_tokens: searchQuery.continuation_tokens,
      corpus_import_ids: searchQuery.corpus_import_ids,
      concept_filters: searchQuery.concept_filters,
      metadata: searchQuery.metadata,
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

    const resultsQuery = getSearch(searchQuery);

    resultsQuery.then((res) => {
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
    });
  }, [searchQuery, runFreshSearch]);

  return { status, families, hits, continuationToken, searchQuery };
};

export default useSearch;
