import { useQuery } from "react-query";

import { ApiClient } from "@/api/http-common";
import { useEnvConfig } from "@/context/EnvConfig";
import { TCountry } from "@/types";

export default function useCountries() {
  const { CONCEPTS_API_URL } = useEnvConfig();

  return useQuery("geographies", async () => {
    const client = new ApiClient();
    const geographiesUrl = `${CONCEPTS_API_URL}/geographies`;
    const query_response = await client.get(geographiesUrl);
    const countries: TCountry[] = query_response.data;
    return countries;
  });
}
