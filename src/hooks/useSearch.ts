import { useEffect, useState } from "react";
import { ApiClient, getEnvFromServer } from "../api/http-common";
import { initialSearchCriteria } from "../constants/searchCriteria";
import { getCachedSearch, updateCacheSearch, TCacheResult } from "@utils/searchCache";
import { TFamily, TSearch, TSearchCriteria } from "../types";

type TConfig = {
  headers: {
    accept: string;
    "Content-Type": string;
  };
};

export async function getSearch(query = initialSearchCriteria) {
  const config: TConfig = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const { data } = await getEnvFromServer();
  const client = new ApiClient(data?.env?.api_url);
  // TODO: remove this attribute as/when the API returns families as default
  query.group_documents = true;
  const results = await client.post<TSearch>(`/searches`, query, config);
  return results;
}

const useSearch = (query: TSearchCriteria) => {
  const [status, setStatus] = useState<"fetched" | "loading" | "idle">("idle");
  const [families, setFamilies] = useState<TFamily[]>([]);
  const [hits, setHits] = useState<number>(null);

  useEffect(() => {
    setStatus("loading");

    // Check if we have a cached result before calling the API
    const cacheId = {
      query_string: query.query_string,
      exact_match: query.exact_match,
      keyword_filters: query.keyword_filters,
      year_range: query.year_range,
      sort_field: query.sort_field,
      sort_order: query.sort_order,
      offset: query.offset,
    };

    const cachedResult = getCachedSearch(cacheId);

    if (cachedResult) {
      setFamilies(cachedResult?.families || []);
      setHits(cachedResult.hits);
      setStatus("fetched");
      return;
    }

    const resultsQuery = getSearch(query);

    resultsQuery.then((res) => {
      if (res.status === 200) {
        setFamilies(res.data.families);
        setHits(res.data.hits);

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
  }, [query]);

  return { status, families, hits };
};

export default useSearch;
