import { useQuery } from "react-query";
import { ApiClient, getEnvFromServer } from "../api/http-common";
import { extractNestedData } from "@utils/extractNestedData";
import { TMeta, TDocumentType, TGeography } from "@types";

type TDataNode<T> = {
  node: T;
  children: T[];
};

type TQueryResponse = {
  document_types: TDocumentType[];
  geographies: TDataNode<TGeography>[];
  instruments: TMeta[];
  sectors: TMeta[];
  regions: TGeography[];
  countries: TGeography[];
};

export default function useConfig(path: string) {
  return useQuery(
    path,
    async () => {
      const { data } = await getEnvFromServer();
      const client = new ApiClient(data?.env?.api_url);
      const query_response = await client.get(`/${path}`, null);
      const response = query_response.data.metadata.CCLW;
      const response_geo = extractNestedData<TGeography>(response.geographies, 2, "");
      const document_types = response.document_types;
      const geographies = response.geographies;
      const instruments = response.instruments;
      const sectors = extractNestedData<TMeta>(response.sectors, 1, "").level1;
      const regions = response_geo.level1;
      const countries = response_geo.level2;

      const resp_end: TQueryResponse = {
        document_types,
        geographies,
        instruments,
        sectors,
        regions,
        countries,
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
