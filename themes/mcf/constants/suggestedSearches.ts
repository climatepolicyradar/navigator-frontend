import { QUERY_PARAMS } from "@/constants/queryParams";
import { TSearchSuggestion } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";

export const SUGGESTED_SEARCHES: TSearchSuggestion[] = [
  {
    label: "Adaptation",
    params: {
      [QUERY_PARAMS.query_string]: "Adaptation",
    },
    newParams: {
      [QUERY_PARAMS.filters]: deflateFilters({
        op: "or",
        filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q557", checked: true }],
      }),
    },
  },
  {
    label: "Extreme Weather",
    params: {
      [QUERY_PARAMS.query_string]: "Extreme Weather",
    },
    newParams: {
      [QUERY_PARAMS.filters]: deflateFilters({
        op: "or",
        filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q374", checked: true }],
      }),
    },
  },
  {
    label: "Philippines",
    params: {
      [QUERY_PARAMS.country]: "philippines",
    },
    newParams: {
      [QUERY_PARAMS.filters]: deflateFilters({
        op: "and",
        filters: [
          { field: "labels.value.id", op: "contains", value: "region::EAS" },
          { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "country::PHL", checked: true }] },
        ],
      }),
    },
  },
];
