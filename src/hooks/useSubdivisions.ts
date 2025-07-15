import { useQuery } from "react-query";

import { ApiClient } from "../api/http-common";
import { useEnvConfig } from "@/context/EnvConfig";
import { TGeographySubdivision } from "@/types";

export default function useSubdivisions() {
  const { CONCEPTS_API_URL } = useEnvConfig();
  return useQuery(
    ["all-subdivisions"],
    async () => {
      const client = new ApiClient();
      const queryResponse = await client.get(`${CONCEPTS_API_URL}/geographies/subdivisions`, null);
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
