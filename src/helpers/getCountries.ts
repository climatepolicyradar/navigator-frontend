import { ApiClient } from "@/api/http-common";
import { TGeography } from "@/types";

export const getCountries = async () => {
  const client = new ApiClient(process.env.BACKEND_API_URL);
  const { data } = await client.get<TGeography[]>("/geographies");
  return data;
};
