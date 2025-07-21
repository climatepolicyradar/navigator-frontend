import { useQueries } from "react-query";

import { useEnvConfig } from "@/context/EnvConfig";
import { TGeographySubdivision } from "@/types";

import { ApiClient } from "../api/http-common";

export default function useGeographySubdivisions(parentAlpha3Code: string[]) {
  const { CONCEPTS_API_URL } = useEnvConfig();
  const results = useQueries(
    parentAlpha3Code.map((code) => ({
      queryKey: ["subdivisions", code],
      queryFn: async () => {
        const client = new ApiClient();
        const response = await client.get(`${CONCEPTS_API_URL}/geographies/subdivisions/${code}`, null);
        return response.data as TGeographySubdivision[];
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 24,
    }))
  );

  const data = results.flatMap((result) => result.data || []);
  const isLoading = results.some((result) => result.isLoading);

  return { data, isLoading };
}
