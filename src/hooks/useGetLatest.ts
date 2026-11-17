import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { ApiClient, getEnvFromServer } from "@/api/http-common";
import { fetchSearchPrincipalDocuments } from "@/api/search";
import { dayInMilliseconds } from "@/constants/dayInMilleseconds";
import { useEnvConfig } from "@/context/EnvConfig";
import { FeaturesContext } from "@/context/FeaturesContext";
import { ThemeContext } from "@/context/ThemeContext";
import { ISearchDocument, TLatestItem } from "@/types";

type TLatestResponse = {
  import_id: string;
  title: string;
  slug: string;
  created: string;
};

// Not a user-facing sort option, so it's not in `SORT_VALUES`.
const LATEST_ADDED_ORDER_BY = "attributes.created_at desc";

export const toLatestItems = (documents: ISearchDocument[]): TLatestItem[] =>
  documents.map((document) => {
    const slug = String(document.attributes.deprecated_slug ?? "");
    return {
      title: document.title,
      slug,
      date: String(document.attributes.created ?? ""),
      url: `/document/${slug}`,
    };
  });

/**
 * The most recently added principal documents, newest first.
 *
 * Sorted on when the document was added to the database (`attributes.created_at`),
 * not its published date. Comes from `search-api` behind the `new-search` flag,
 * otherwise from the backend `/latest` endpoint.
 */
export default function useGetLatest(limit: number) {
  const { themeConfig, loaded } = useContext(ThemeContext);
  const features = useContext(FeaturesContext);
  const { API_URL } = useEnvConfig();
  const isNewSearch = features["new-search"];

  return useQuery({
    queryKey: ["latest", limit, isNewSearch, themeConfig.searchCategories, API_URL],
    queryFn: async ({ signal }) => {
      if (isNewSearch) {
        const response = await fetchSearchPrincipalDocuments({
          apiUrl: API_URL,
          themeConfig,
          orderBy: LATEST_ADDED_ORDER_BY,
          page_size: String(limit),
          signal,
        });
        return toLatestItems(response.results);
      }

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
    // Wait for the theme config so its search categories are applied
    enabled: !isNewSearch || loaded,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: dayInMilliseconds,
  });
}
