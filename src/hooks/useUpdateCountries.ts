import { useMutation, useQueryClient } from "react-query";

export default function useUpdateCountries() {
  const queryClient = useQueryClient();

  return useMutation(async (value?: any) => {
    const { regionName, regions, countries } = value;
    const region = regions.find((item) => item.slug === regionName);
    let newList = countries;
    if (region) {
      newList = countries.filter((item: any) => item.parent_id === region.id);
    }
    return queryClient.setQueryData("filteredCountries", () => newList);
  });
}
