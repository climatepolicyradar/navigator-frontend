import { useQuery } from "react-query";

import { useEnvConfig } from "@/context/EnvConfig";
import { TGeographyWithDocumentCounts } from "@/types";

import { ApiClient } from "../api/http-common";

export default function useSubdivisions() {
  const { CONCEPTS_API_URL } = useEnvConfig();
  return useQuery(
    ["all-subdivisions"],
    async () => {
      const client = new ApiClient();
      const queryResponse = await client.get(`${CONCEPTS_API_URL}/families/aggregations/by-geography?documents.document_status=published`, null);
      const geographies: TGeographyWithDocumentCounts[] = queryResponse.data.data;

      const subdivisions = geographies.filter((item) => item.type === "ISO-3166-2");

      return subdivisions;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );
}
