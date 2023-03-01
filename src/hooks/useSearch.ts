import { useQuery } from "react-query";
import { ApiClient, getEnvFromServer } from "../api/http-common";
import { initialSearchCriteria } from "../constants/searchCriteria";
import { TSearch } from "../types";

type TSearchReturned = {
  data: TSearch;
};

type TConfig = {
  headers: {
    accept: string;
    "Content-Type": string;
  };
};

async function getResults(query = initialSearchCriteria) {
  const config: TConfig = {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const { data } = await getEnvFromServer();
  const client = new ApiClient(data?.env?.api_url);
  // TODO: remove this as/when the API returns families as default
  query.group_documents = true;
  const results = await client.post(`/searches`, query, config);
  return results;
}

export default function useSearch(id: string, query = initialSearchCriteria) {
  return useQuery<TSearchReturned>(
    id,
    async () => {
      return getResults(query);
    },
    {
      // refetchOnMount: false,
      refetchOnWindowFocus: false,
      cacheTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );
}
