import { ApiClient, getEnvFromServer } from "../api/http-common";
import { initialSearchCriteria } from "../constants/searchCriteria";
import { TSearch } from "../types";

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
