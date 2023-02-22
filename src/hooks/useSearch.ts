import { useQuery } from "react-query";
import { ApiClient, getEnvFromServer } from "../api/http-common";
import { initialSearchCriteria } from "../constants/searchCriteria";

type TSearchReturned = {
  data: {
    hits: number;
    query_time_ms: number;
    documents: any[];
  };
};

export default function useSearch(id: string, query = initialSearchCriteria) {
  const config = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const getResults = async () => {
    const { data } = await getEnvFromServer();
    const client = new ApiClient(data?.env?.api_url);
    const results = await client.post(`/searches`, query, config);
    return results;
  };

  return useQuery<TSearchReturned>(
    id,
    async () => {
      return getResults();
    },
    {
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );
}
