import { useEffect, useState, useMemo } from "react";
import { ApiClient, getEnvFromServer } from "../api/http-common";
import { initialSearchCriteria } from "../constants/searchCriteria";
import { getCachedSearch, updateCacheSearch, TCacheResult } from "@utils/searchCache";
import { TMatchedFamily, TSearch, TLoadingStatus } from "../types";
import buildSearchQuery, { TRouterQuery } from "@utils/buildSearchQuery";

const CACHE_ENABLED = false;

type TConfig = {
  headers: {
    accept: string;
    "Content-Type": string;
  };
};

async function getSearch(query = initialSearchCriteria) {
  const config: TConfig = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const url = "/searches";
  const { data } = await getEnvFromServer();
  const client = new ApiClient(data?.env?.api_url, data?.env?.app_token);
  const results = await client.post<TSearch>(url, query, config);
  return results;
}

const useSearch = (query: TRouterQuery, familyId = "", documentId = "", runFreshSearch: boolean = true, noOfPassagesPerDoc: number = undefined) => {
  const [status, setStatus] = useState<TLoadingStatus>("idle");
  const [families, setFamilies] = useState<TMatchedFamily[]>([]);
  const [hits, setHits] = useState<number>(null);
  const [continuationToken, setContinuationToken] = useState<string | null>(null);

  const searchQuery = useMemo(() => {
    return buildSearchQuery({ ...query }, familyId, documentId, undefined, noOfPassagesPerDoc);
  }, [query, familyId, documentId, noOfPassagesPerDoc]);

  useEffect(() => {
    setStatus("loading");

    // If we don't want to trigger an API call, return early
    if (!runFreshSearch) {
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
