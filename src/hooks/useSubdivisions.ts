import { useQuery } from "react-query";

import { useEnvConfig } from "@/context/EnvConfig";
import { TGeographyWithDocumentCounts } from "@/types";

import useThemeConfig from "./useThemeConfig";
import { ApiClient } from "../api/http-common";

export default function useSubdivisions() {
  const { CONCEPTS_API_URL } = useEnvConfig();
  const { themeConfig } = useThemeConfig();
  const defaultCorpora = themeConfig?.defaultCorpora;
  const corpora = defaultCorpora ?? themeConfig?.categories?.options.find((option) => option.slug === "All")?.value;
  const corpusFilters = corpora ? corpora?.map((corpus) => `&corpus.import_id=${corpus}`).join("") : "";

  return useQuery(
    ["all-subdivisions-with-data"],
    async () => {
      const client = new ApiClient();
      const queryResponse = await client.get(
        `${CONCEPTS_API_URL}/families/aggregations/by-geography?documents.document_status=published${corpusFilters}`,
        null
      );
      const geographies: TGeographyWithDocumentCounts[] = queryResponse.data.data;

      const subdivisions = geographies.filter((item) => item.type === "ISO-3166-2");
      return subdivisions;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 24,
      enabled: Boolean(themeConfig),
    }
  );
}
