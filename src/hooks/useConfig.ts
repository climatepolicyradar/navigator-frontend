import { useQuery } from "@tanstack/react-query";

import { dayInMilliseconds } from "@/constants/dayInMilleseconds";
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
  return useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const { data } = await getEnvFromServer();
      const client = new ApiClient(data?.env?.api_url, data?.env?.app_token);
      const { config, error: configError } = await client.getConfig();
      if (configError) console.error(configError);
      const geographies = config.geographies;
      const [regions, countries, subdivisions] = extractNestedData<TGeography>(geographies);
      const corpus_types = config.corpus_types;

      const resp_end: TConfigQueryResponse = {
        geographies,
        regions,
        countries,
        subdivisions,
        languages: config.languages,
        corpus_types,
      };
      return resp_end;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: dayInMilliseconds,
  });
}
