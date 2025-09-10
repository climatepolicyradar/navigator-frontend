import { useQuery } from "react-query";

import { ApiClient, getEnvFromServer } from "@/api/http-common";
import { TLatestItem } from "@/types";

type TLatestReponse = {
  title: string;
  slugs: string[];
  created: string;
};

export default function useGetLatest(limit?: number) {
  return useQuery(
    "latest",
    async () => {
      const { data } = await getEnvFromServer();
      const client = new ApiClient(data?.env?.api_url, data?.env?.app_token);
      const query_response = await client.get<TLatestReponse[]>("/latest", { limit: limit });
      return query_response.data.map((item) => ({
        title: item.title,
        slug: item.slugs[0],
        date: item.created,
        url: `/document/${item.slugs[0]}`,
      })) as TLatestItem[];
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );
}
