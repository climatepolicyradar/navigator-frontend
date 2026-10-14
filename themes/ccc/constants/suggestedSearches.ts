import { QUERY_PARAMS } from "@/constants/queryParams";
import { TSearchSuggestion } from "@/types";

const year = new Date().getUTCFullYear();

export const SUGGESTED_SEARCHES: TSearchSuggestion[] = [
  {
    label: "Brazil + Federal Constitution of 1988",
    params: {
      [QUERY_PARAMS.concept_preferred_label]: ["principal_law/Brazil", "principal_law/Federal Constitution of 1988"],
      [QUERY_PARAMS.country]: "Brazil",
    },
    newParams: {
      [QUERY_PARAMS.filters]: JSON.stringify({
        op: "and",
        filters: [
          {
            op: "and",
            filters: [
              { field: "labels.value.id", op: "contains", value: "region::LCN" },
              { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "country::BRA", checked: true }] },
            ],
          },
          {
            op: "and",
            filters: [
              { field: "labels.value.id", op: "contains", value: "principal_law::Brazil" },
              {
                op: "or",
                filters: [{ field: "labels.value.id", op: "contains", value: "principal_law::Federal+Constitution+of+1988", checked: true }],
              },
            ],
          },
        ],
      }),
    },
  },
  {
    label: "National Environmental Policy Act (NEPA) + Alaska",
    params: {
      [QUERY_PARAMS.concept_preferred_label]: ["principal_law/United States", "principal_law/National Environmental Policy Act (NEPA)"],
      [QUERY_PARAMS.subdivision]: "US-AK",
    },
    newParams: {
      [QUERY_PARAMS.filters]: JSON.stringify({
        op: "and",
        filters: [
          {
            op: "and",
            filters: [
              { field: "labels.value.id", op: "contains", value: "region::NAC" },
              {
                op: "and",
                filters: [
                  { field: "labels.value.id", op: "contains", value: "country::USA" },
                  { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "subdivision::US-AK", checked: true }] },
                ],
              },
            ],
          },
          {
            op: "and",
            filters: [
              { field: "labels.value.id", op: "contains", value: "principal_law::United+States" },
              {
                op: "or",
                filters: [
                  { field: "labels.value.id", op: "contains", value: "principal_law::National+Environmental+Policy+Act+(NEPA)", checked: true },
                ],
              },
            ],
          },
        ],
      }),
    },
  },
  {
    label: "Sub-Saharan Africa + Cases filed in last 5 years",
    params: {
      [QUERY_PARAMS.region]: "sub-saharan-africa",
      [QUERY_PARAMS.year_range]: [(year - 5).toString(), year.toString()],
    },
    newParams: {
      [QUERY_PARAMS.filters]: JSON.stringify({
        op: "and",
        filters: [
          { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "region::SSF", checked: true }] },
          { field: "attributes.published_date", key: "published_date", op: "gte", value: `${year - 5}-01-01T00:00:00.000Z` },
          { field: "attributes.published_date", key: "published_date", op: "lte", value: `${year}-12-31T23:59:59.999Z` },
        ],
      }),
    },
  },
];
