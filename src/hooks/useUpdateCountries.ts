import { useMutation, useQueryClient } from "react-query";
import { TGeography } from "@types";

type TMutationProps = {
  regionName: string;
  regions: TGeography[];
  countries: TGeography[];
};

export default function useUpdateCountries() {
  const queryClient = useQueryClient();

  return useMutation(async (value: TMutationProps) => {
    const { regionName, regions, countries } = value;
    const region = regions.find((item) => item.display_value === regionName);
    let newList = countries;
    if (region) {
      newList = countries.filter((item: any) => item.parent_id === region.id);
    }
    return queryClient.setQueryData<TGeography[]>("filteredCountries", () => newList);
  });
}
