import { useQuery } from "react-query";

import { ApiClient } from "@/api/http-common";
import { useEnvConfig } from "@/context/EnvConfig";
import { TGeography } from "@/types";

export default function useGetCountries() {
  const { CONCEPTS_API_URL } = useEnvConfig();

  return useQuery("geographies", async () => {
    const client = new ApiClient();
    const query_response = await client.getCountries(CONCEPTS_API_URL);
    const countries: TGeography[] = query_response.data;

    console.log("useGetCountries", countries);
    // console.log("data", data);
    // return countries;
  });
}
