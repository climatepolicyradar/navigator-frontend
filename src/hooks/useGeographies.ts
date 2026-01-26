import { useQuery } from "@tanstack/react-query";

import { dayInMilliseconds } from "@/constants/dayInMilleseconds";

import { ApiClient, getEnvFromServer } from "../api/http-common";

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
    LITIGATION: number;
  };
};

export default function useGeographies() {
  return useQuery({
    queryKey: ["geographies"],
    queryFn: async () => {
      const { data } = await getEnvFromServer();
      const client = new ApiClient(data?.env?.api_url, data?.env?.app_token);
      const query_response = await client.get("/geographies", null);
      const mapData: TMapGeographyStats[] = query_response.data;

      return mapData;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    gcTime: dayInMilliseconds,
  });
}
