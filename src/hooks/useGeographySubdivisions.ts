import { useQuery } from "react-query";

import { useEnvConfig } from "@/context/EnvConfig";
import { TGeographySubdivision } from "@/types";

import { ApiClient } from "../api/http-common";

export default function useGeographySubdivisions(parentAlpha3Code: string[]) {
  const { CONCEPTS_API_URL } = useEnvConfig();
  return useQuery(
    ["subdivisions", parentAlpha3Code],
    async () => {
      const client = new ApiClient();
      const results = await Promise.all(
        parentAlpha3Code.map(async (code) => {
          const response = await client.get(`${CONCEPTS_API_URL}/geographies/subdivisions/${code}`, null);
          return response.data as TGeographySubdivision[];
        })
      );
      return results.flat();
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );
}
