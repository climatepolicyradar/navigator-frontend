import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { ID_SEPARATOR } from "@/constants/chars";
import { dayInMilliseconds } from "@/constants/dayInMilleseconds";
import { useEnvConfig } from "@/context/EnvConfig";
import { ThemeContext } from "@/context/ThemeContext";
import useConfig from "@/hooks/useConfig";
import { TApiItemResponse, TGeography } from "@/types";
import { getCookie } from "@/utils/cookies";
import { getFeatureFlags } from "@/utils/featureFlags";
import { getFeatures } from "@/utils/features";
import { getGeographySlug } from "@/utils/geography";

import { ApiClient } from "../api/http-common";

export type TCountryOption = {
  // The country's ISO 3166-1 alpha-3 code when from the taxonomy (e.g. "AUS"), or its /config id
  id: string;
  slug: string;
  display_value: string;
};

type TTaxonomyNode = {
  id: string;
  type: string;
  value: string;
  children: TTaxonomyNode[];
};

const COUNTRY_TAXONOMY_PATTERN = "**/country::*";

// The search API returns each match with its ancestors, so countries arrive nested under their region
const flattenCountries = (nodes: TTaxonomyNode[]): TTaxonomyNode[] =>
  nodes.flatMap((node) => [...(node.type === "country" ? [node] : []), ...flattenCountries(node.children ?? [])]);

export const toCountryOptions = (taxonomy: TTaxonomyNode[]): TCountryOption[] =>
  flattenCountries(taxonomy)
    .flatMap((country) => {
      const slug = getGeographySlug(country);
      // No slug means a system geography (e.g. International) with no geography page
      return slug ? [{ id: country.id.split(ID_SEPARATOR)[1], slug, display_value: country.value }] : [];
    })
    .sort((a, b) => a.display_value.localeCompare(b.display_value));

const configGeographyToCountryOption = (geography: TGeography): TCountryOption => ({
  id: String(geography.id),
  slug: geography.slug,
  display_value: geography.display_value,
});

// Pages using this hook are cached publicly, so PostHog flags can't be read from cookies on the server. Evaluate on the client instead.
const useIsNewSearch = (): boolean => {
  const { themeConfig } = useContext(ThemeContext);
  const featureFlagsCookie = typeof document === "undefined" ? "" : getCookie("feature_flags");

  return getFeatures(themeConfig, getFeatureFlags({ feature_flags: featureFlagsCookie }))["new-search"];
};

/**
 * Countries for geography pickers. With new search on these come from the search API's label taxonomy, otherwise from /config.
 * @see: https://linear.app/climate-policy-radar/issue/FUS-960
 */
export default function useCountryOptions(): { data: TCountryOption[]; isLoading: boolean } {
  const { API_URL } = useEnvConfig();
  const isNewSearch = useIsNewSearch();
  const configQuery = useConfig();

  const taxonomyQuery = useQuery({
    queryKey: ["country-options"],
    queryFn: async () => {
      const client = new ApiClient(API_URL);
      const response = await client.get<TApiItemResponse<TTaxonomyNode[]>>("/search/labels:taxonomy", { include: COUNTRY_TAXONOMY_PATTERN });

      return toCountryOptions(response.data.data);
    },
    enabled: isNewSearch,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: dayInMilliseconds,
  });

  if (isNewSearch) return { data: taxonomyQuery.data ?? [], isLoading: taxonomyQuery.isLoading };

  return { data: (configQuery.data?.countries ?? []).map(configGeographyToCountryOption), isLoading: configQuery.isLoading };
}
