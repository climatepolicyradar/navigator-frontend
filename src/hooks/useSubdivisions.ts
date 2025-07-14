import { useQuery } from "react-query";

import { ApiClient, getEnvFromServer } from "../api/http-common";
import { TGeographySubdivision } from "@/types";

export default function useSubdivisions() {
  return useQuery(
    ["all-subdivisions"],
    async () => {
      const { data } = await getEnvFromServer();
      const client = new ApiClient(process.env.CONCEPTS_API_URL, data?.env?.app_token);

      const queryResponse = await client.get(`/geographies/subdivisions`, null);
      const subdivisions: TGeographySubdivision[] = queryResponse.data;
      return subdivisions;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );
}
