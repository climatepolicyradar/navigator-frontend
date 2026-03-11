import { QUERY_PARAMS } from "@/constants/queryParams";
import { TSuggestedSearch } from "@/types";

const thisYear = new Date().getUTCFullYear();

export const SUGGESTED_SEARCHES: TSuggestedSearch[] = [
  {
    label: "Brazil + Federal Constitution of 1988",
    params: {
      [QUERY_PARAMS.query_string]: "Federal Constitution of 1988",
      [QUERY_PARAMS.country]: "Brazil",
    },
  },
  {
    label: "National Environmental Policy Act (NEPA) + Alaska",
    params: {
      [QUERY_PARAMS.subdivision]: "US-AK",
      [QUERY_PARAMS.query_string]: "National Environmental Policy Act (NEPA)",
    },
  },
  {
    label: "Sub-Saharan Africa + Cases filed in last 5 years",
    params: {
      [QUERY_PARAMS.region]: "Sub-Saharan Africa",
      [QUERY_PARAMS.year_range]: [(thisYear - 5).toString(), thisYear.toString()],
    },
  },
];
