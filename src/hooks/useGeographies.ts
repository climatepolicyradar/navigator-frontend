import { useQuery } from "react-query";
import { ApiClient } from "../api/http-common";
import { config } from "../config";

type TMapGeographyStats = {
  display_name: string;
  iso_code: string;
  slug: string;
  family_counts: {
    UNFCCC: number;
    EXECUTIVE: number;
    LEGISLATIVE: number;
    MCF: number;
    REPORTS: number;
  };
};

export default function useGeographies() {
  return useQuery(
    "geographies",
    async () => {
      const client = new ApiClient(config.apiUrl, config.appToken);
      const query_response = await client.get("/geographies", null);
      const mapData: TMapGeographyStats[] = query_response.data;

      return mapData;
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      cacheTime: 1000 * 60 * 60 * 24,
    }
  );
}
