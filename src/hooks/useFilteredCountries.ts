import { useQuery, useQueryClient } from "react-query";
import { TGeography } from "@/types";

export default function useFilteredCountries(all: TGeography[]) {
  const queryClient = useQueryClient();

  return useQuery(
    "filteredCountries",
    () => {
      const existingCountries: TGeography[] = queryClient.getQueryData("filteredCountries");
      return existingCountries?.length ? existingCountries : all;
    },
    {
      refetchOnWindowFocus: false,
      enabled: all.length > 0,
      cacheTime: Infinity,
    }
  );
}
