import { useQuery } from "@tanstack/react-query";

import { ApiClient, getEnvFromServer } from "@/api/http-common";
import { TLatestItem } from "@/types";

type TLatestResponse = {
  import_id: string;
  title: string;
  slug: string;
  created: string;
};

export default function useGetLatest(limit?: number) {
  return useQuery({
    queryKey: ["latest"],
    queryFn: async () => {
      const { data } = await getEnvFromServer();
      const client = new ApiClient(data?.env?.api_url, data?.env?.app_token);
      const query_response = await client.get<TLatestResponse[]>("/latest", { limit: limit });
      return query_response.data.map((item) => ({
        title: item.title,
        slug: item.slug,
        date: item.created,
        url: `/document/${item.slug}`,
      })) as TLatestItem[];
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: 1000 * 60 * 60 * 24,
  });
}
