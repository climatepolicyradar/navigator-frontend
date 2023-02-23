import { useQuery, useQueryClient } from "react-query";

type TQuery = {
  data: {
    hits: number;
    query_time_ms: number;
    documents: any[];
  }
}

export default function useGetSearchResults() {
  const queryClient = useQueryClient();
  return useQuery<TQuery>("searches", () => queryClient.getQueryData("searches"), {
    refetchOnWindowFocus: false,
  });
}
