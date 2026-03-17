import { QUERY_PARAMS } from "@/constants/queryParams";
import { TSuggestedSearch } from "@/types";

export const SUGGESTED_SEARCHES: TSuggestedSearch[] = [
  {
    label: "Latest NDCs",
    params: {
      [QUERY_PARAMS.category]: "UN-submissions",
      [QUERY_PARAMS["_document.type"]]: "Nationally Determined Contribution",
      [QUERY_PARAMS.author_type]: "Party",
    },
  },
  {
    label: "Indigenous people + Brazil + Laws",
    params: {
      [QUERY_PARAMS.country]: "brazil",
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.concept_name]: "indigenous people",
    },
  },
  {
    label: "Zoning and spatial planning + marine",
    params: {
      [QUERY_PARAMS.concept_name]: "zoning and spatial planning",
      [QUERY_PARAMS.query_string]: "marine",
      [QUERY_PARAMS.exact_match]: "true",
    },
  },
  {
    label: "Climate framework laws",
    params: {
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.framework_laws]: "true",
    },
  },
];
