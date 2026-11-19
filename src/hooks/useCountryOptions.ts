import { useQuery } from "@tanstack/react-query";

import { ID_SEPARATOR } from "@/constants/chars";
import { dayInMilliseconds } from "@/constants/dayInMilleseconds";
import { useEnvConfig } from "@/context/EnvConfig";
import { TApiItemResponse, TCountryOption, TNestedSearchLabel } from "@/types";
import { getGeographySlug } from "@/utils/geography";
import { flattenNestedLabels } from "@/utils/labels/flattenNestedLabels";

import { ApiClient } from "../api/http-common";

const COUNTRY_TAXONOMY_PATTERN = "**/country::*";

// The search API returns each match with its ancestors, so countries arrive nested under their region
export const toCountryOptions = (taxonomy: TNestedSearchLabel[]): TCountryOption[] =>
  flattenNestedLabels(taxonomy)
    .filter((label) => label.type === "country")
    .flatMap((country) => {
      const slug = getGeographySlug(country);
      // No slug means a system geography (e.g. International) with no geography page
      return slug ? [{ id: country.id.split(ID_SEPARATOR)[1], slug, display_value: country.value }] : [];
    })
    .sort((a, b) => a.display_value.localeCompare(b.display_value));

/**
 * Countries for geography pickers, from the search API's label taxonomy.
 * @see: https://linear.app/climate-policy-radar/issue/FUS-960
 */
export default function useCountryOptions(): { data: TCountryOption[]; isLoading: boolean } {
  const { API_URL } = useEnvConfig();

  const taxonomyQuery = useQuery({
    queryKey: ["country-options"],
    queryFn: async () => {
      const client = new ApiClient(API_URL);
      const response = await client.get<TApiItemResponse<TNestedSearchLabel[]>>("/search/labels:taxonomy", { include: COUNTRY_TAXONOMY_PATTERN });

      return toCountryOptions(response.data.data);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: dayInMilliseconds,
  });

  return { data: taxonomyQuery.data ?? [], isLoading: taxonomyQuery.isLoading };
}
