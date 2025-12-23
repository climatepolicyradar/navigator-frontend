import { useQuery } from "react-query";

import { TGeography, TLanguages, TCorpusTypeDictionary, TDataNode } from "@/types";
import { extractNestedData } from "@/utils/extractNestedData";

import { ApiClient, getEnvFromServer } from "../api/http-common";

export type TConfigQueryResponse = {
  geographies: TDataNode<TGeography>[];
  regions: TGeography[];
  countries: TGeography[];
  subdivisions: TGeography[];
  languages: TLanguages;
  corpus_types: TCorpusTypeDictionary;
};

export default function useConfig() {
  return useQuery(
    "config",
    async () => {
      const { data } = await getEnvFromServer();
      const client = new ApiClient(data?.env?.api_url, data?.env?.app_token);
      const query_response = await client.getConfig();
      const geographies = query_response.data.geographies;
      const [regions, countries, subdivisions] = extractNestedData<TGeography>(geographies);
      const corpus_types = query_response.data.corpus_types;

      const resp_end: TConfigQueryResponse = {
        geographies,
        regions,
        countries,
        subdivisions,
        languages: query_response.data.languages,
        corpus_types,
      };
      return resp_end;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );
}
