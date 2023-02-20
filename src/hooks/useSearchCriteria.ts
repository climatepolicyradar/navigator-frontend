import { useQuery, useQueryClient } from "react-query";
import { initialSearchCriteria } from "../constants/searchCriteria";
import { TSearchCriteria } from "@types";

export default function useSearchCriteria() {
  const queryClient = useQueryClient();
  return useQuery<TSearchCriteria>(
    "searchCriteria",
    () => {
      const existingCriteria: TSearchCriteria = queryClient.getQueryData("searchCriteria");
      return existingCriteria ? existingCriteria : initialSearchCriteria;
    },
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
    }
  );
}
