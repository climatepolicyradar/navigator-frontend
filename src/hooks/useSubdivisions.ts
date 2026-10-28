import { useQuery } from "@tanstack/react-query";

import { dayInMilliseconds } from "@/constants/dayInMilleseconds";
import { useEnvConfig } from "@/context/EnvConfig";
import { TApiItemResponse, TApiGeographyLabelCount, TGeographyWithDocumentCounts } from "@/types";

import { ApiClient } from "../api/http-common";

/* data-in identifies geographies by a prefixed label id, e.g. "subdivision::MX-TAB",
 * whereas consumers of this hook work in bare ISO-3166-2 codes. */
const SUBDIVISION_LABEL_PREFIX = "subdivision::";

const toSubdivisionWithCounts = (geography: TApiGeographyLabelCount): TGeographyWithDocumentCounts => ({
  code: geography.id.replace(SUBDIVISION_LABEL_PREFIX, ""),
  name: geography.name,
  type: geography.type,
  count: geography.count,
});

export default function useSubdivisions() {
  const { CONCEPTS_API_URL } = useEnvConfig();

  return useQuery({
    queryKey: ["all-subdivisions-with-data"],
    queryFn: async () => {
      const client = new ApiClient();
      const queryResponse = await client.get<TApiItemResponse<TApiGeographyLabelCount[]>>(
        `${CONCEPTS_API_URL}/data-in/documents:aggregateByGeography?attributes.status=published&labels.value.type=subdivision`,
        null
      );

      return queryResponse.data.data.map(toSubdivisionWithCounts);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: dayInMilliseconds,
  });
}
