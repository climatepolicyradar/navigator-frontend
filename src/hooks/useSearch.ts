import { useEffect, useState, useMemo } from "react";
import { ApiClient, getEnvFromServer } from "../api/http-common";
import { initialSearchCriteria } from "../constants/searchCriteria";
import { getCachedSearch, updateCacheSearch, TCacheResult } from "@utils/searchCache";
import { TFamily, TSearch } from "../types";
import buildSearchQuery, { TRouterQuery } from "@utils/buildSearchQuery";

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

  const { data } = await getEnvFromServer();
  const client = new ApiClient(data?.env?.api_url);
  // TODO: remove group_documents attribute as/when the API returns families as default
  const results = await client.post<TSearch>(`/searches?group_documents=True`, query, config);
  return results;
}

const useSearch = (query: TRouterQuery) => {
  const [status, setStatus] = useState<"fetched" | "loading" | "idle">("idle");
  const [families, setFamilies] = useState<TFamily[]>([]);
  const [hits, setHits] = useState<number>(null);

  const searchQuery = useMemo(() => {
    return buildSearchQuery({ ...query });
  }, [query]);

  useEffect(() => {
    setStatus("loading");

    // Check if we have a cached result before calling the API
    const cacheId = {
      query_string: searchQuery.query_string,
      exact_match: searchQuery.exact_match,
      keyword_filters: searchQuery.keyword_filters,
      year_range: searchQuery.year_range,
      sort_field: searchQuery.sort_field,
      sort_order: searchQuery.sort_order,
      offset: searchQuery.offset,
    };

    const cachedResult = getCachedSearch(cacheId);

    if (cachedResult) {
      setFamilies(cachedResult?.families || []);
      setHits(cachedResult.hits);
      setStatus("fetched");
      return;
    }

    const resultsQuery = getSearch(searchQuery);

    resultsQuery.then((res) => {
      if (res.status === 200) {
        // Catch missing attributes fro the API response
        setFamilies(res.data.families || []);
        setHits(res.data.hits || 0);

        const searchToCache: TCacheResult = {
          ...cacheId,
          families: res.data.families,
          hits: res.data.hits,
          timestamp: new Date().getTime(),
        };
        updateCacheSearch(searchToCache);
      }
      setStatus("fetched");
    });
  }, [searchQuery]);

  return { status, families, hits, searchQuery };
};

export default useSearch;
