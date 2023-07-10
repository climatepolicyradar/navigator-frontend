import { useEffect, useState, useMemo } from "react";
import { ApiClient, getEnvFromServer } from "../api/http-common";
import { initialSearchCriteria } from "../constants/searchCriteria";
import { getCachedSearch, updateCacheSearch, TCacheResult } from "@utils/searchCache";
import { TMatchedFamily, TSearch, TLoadingStatus } from "../types";
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
  // TODO: remove this later when BE is updated
  query["jit_query"] = "disabled";
  query["include_results"] = ["htmlsNonTranslated", "pdfsTranslated"];
  const results = await client.post<TSearch>("/searches", query, config);
  return results;
}

const useSearch = (query: TRouterQuery, runFreshSearch: boolean = true) => {
  const [status, setStatus] = useState<TLoadingStatus>("idle");
  const [families, setFamilies] = useState<TMatchedFamily[]>([]);
  const [hits, setHits] = useState<number>(null);

  const searchQuery = useMemo(() => {
    return buildSearchQuery({ ...query });
  }, [query]);

  useEffect(() => {
    setStatus("loading");

    // If we don't want to trigger an API call, return early
    if (!runFreshSearch) {
      setStatus("success");
      return;
    }

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
      setStatus("success");
      return;
    }

    const resultsQuery = getSearch(searchQuery);

    resultsQuery.then((res) => {
      if (res.status === 200) {
        // Catch missing attributes from the API response
        setFamilies(res.data.families || []);
        setHits(res.data.hits || 0);

        const searchToCache: TCacheResult = {
          ...cacheId,
          families: res.data.families,
          hits: res.data.hits,
          timestamp: new Date().getTime(),
        };
        updateCacheSearch(searchToCache);
      } else {
        setFamilies([]);
        setHits(0);
        setStatus("error");
      }
      setStatus("success");
    });
  }, [searchQuery, runFreshSearch]);

  return { status, families, hits, searchQuery };
};

export default useSearch;
