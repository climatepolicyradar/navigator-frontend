import { useQuery } from "react-query";
import { ApiClient, getEnvFromServer } from "../api/http-common";
import { extractNestedData } from "@utils/extractNestedData";
import { TGeography, TLanguages } from "@types";

type TDataNode<T> = {
  node: T;
  children: T[];
};

type TQueryResponse = {
  geographies: TDataNode<TGeography>[];
  regions: TGeography[];
  countries: TGeography[];
  languages: TLanguages;
};

export default function useConfig() {
  return useQuery(
    "config",
    async () => {
      const { data } = await getEnvFromServer();
      const client = new ApiClient(data?.env?.api_url);
      const query_response = await client.get("/config", null);
      const geographies = query_response.data.geographies;
      const response_geo = extractNestedData<TGeography>(geographies, 2, "");
      const regions = response_geo.level1;
      const countries = response_geo.level2;

      const resp_end: TQueryResponse = {
        geographies,
        regions,
        countries,
        languages: query_response.data.languages,
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
