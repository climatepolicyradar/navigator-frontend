import { useQuery } from "react-query";

import { ApiClient, getEnvFromServer } from "../api/http-common";

type TSubdivision = {
  code: string;
  name: string;
  type: string;
  country_alpha_2: string;
  country_alpha_3: string;
};

export default function useGeographySubdivisions(parentAlpha3Code: string[]) {
  return useQuery(
    ["subdivisions", parentAlpha3Code],
    async () => {
      const { data } = await getEnvFromServer();
      const client = new ApiClient(data?.env?.api_url, data?.env?.app_token);

      const results = await Promise.all(
        parentAlpha3Code.map(async (code) => {
          const response = await client.get(`/geographies/subdivisions/${code}`, null);
          return response.data as TSubdivision[];
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
