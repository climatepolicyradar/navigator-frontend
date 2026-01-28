import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TGeography } from "@/types";

interface IProps {
  regionName: string;
  regions: TGeography[];
  countries: TGeography[];
}

export default function useUpdateCountries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: IProps) => {
      const { regionName, regions, countries } = value;
      const region = regions.find((item) => item.slug === regionName);
      let newList = countries;
      if (region) {
        newList = countries.filter((item: any) => item.parent_id === region.id);
      }
      return queryClient.setQueryData<TGeography[]>(["filteredCountries"], () => newList);
    },
  });
}
