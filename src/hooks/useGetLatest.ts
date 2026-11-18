import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { fetchSearchPrincipalDocuments } from "@/api/search";
import { dayInMilliseconds } from "@/constants/dayInMilleseconds";
import { useEnvConfig } from "@/context/EnvConfig";
import { ThemeContext } from "@/context/ThemeContext";
import { ISearchDocument, TLatestItem } from "@/types";

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
 * The most recently added principal documents from `search-api`, newest first.
 *
 * Sorted on when the document was added to the database (`attributes.created_at`),
 * not its published date.
 */
export default function useGetLatest(limit: number) {
  const { themeConfig, loaded } = useContext(ThemeContext);
  const { API_URL } = useEnvConfig();

  return useQuery({
    queryKey: ["latest", limit, themeConfig.searchCategories, API_URL],
    queryFn: async ({ signal }) => {
      const response = await fetchSearchPrincipalDocuments({
        apiUrl: API_URL,
        themeConfig,
        orderBy: LATEST_ADDED_ORDER_BY,
        page_size: String(limit),
        signal,
      });
      return toLatestItems(response.results);
    },
    // Wait for the theme config so its search categories are applied
    enabled: loaded,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: dayInMilliseconds,
  });
}
