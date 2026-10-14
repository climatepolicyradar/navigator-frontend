import { QUERY_PARAMS } from "@/constants/queryParams";
import { TSearchSuggestion } from "@/types";

export const SUGGESTED_SEARCHES: TSearchSuggestion[] = [
  {
    label: "Latest NDCs",
    params: {
      [QUERY_PARAMS.category]: "UN-submissions",
      [QUERY_PARAMS["_document.type"]]: "Nationally Determined Contribution",
      [QUERY_PARAMS.author_type]: "Party",
      [QUERY_PARAMS.sort_field]: "date",
      [QUERY_PARAMS.sort_order]: "desc",
    },
    newParams: {
      [QUERY_PARAMS.filters]: JSON.stringify({
        op: "and",
        filters: [
          { field: "labels.value.id", op: "contains", value: "category::UN submission" },
          {
            op: "and",
            filters: [
              { field: "labels.value.id", op: "contains", value: "un_convention::UNFCCC" },
              {
                op: "or",
                filters: [
                  { field: "labels.value.id", op: "contains", value: "entity_type::Nationally Determined Contribution (NDC)", checked: true },
                ],
              },
            ],
          },
        ],
      }),
      [QUERY_PARAMS.sort]: "recent",
    },
  },
  {
    label: "Just transition + Türkiye + Laws",
    params: {
      [QUERY_PARAMS.country]: "turkey",
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.concept_name]: "just transition",
    },
    newParams: {
      [QUERY_PARAMS.filters]: JSON.stringify({
        op: "and",
        filters: [
          { field: "labels.value.id", op: "contains", value: "category::Law", checked: true },
          {
            op: "and",
            filters: [
              { field: "labels.value.id", op: "contains", value: "region::ECS" },
              { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "country::TUR", checked: true }] },
            ],
          },
          { field: "labels.value.id", op: "contains", value: "concept::Q47", checked: true },
        ],
      }),
    },
  },
  {
    label: "Adaptation/resilience + buildings",
    params: {
      [QUERY_PARAMS.concept_name]: "adaptation/resilience",
      [QUERY_PARAMS.query_string]: "buildings",
      [QUERY_PARAMS.exact_match]: "true",
    },
    newParams: {
      [QUERY_PARAMS.query_string]: "buildings",
      [QUERY_PARAMS.filters]: JSON.stringify({
        op: "or",
        filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q557", checked: true }],
      }),
    },
  },
  {
    label: "Climate framework laws",
    params: {
      [QUERY_PARAMS.category]: "laws",
      [QUERY_PARAMS.framework_laws]: "true",
      [QUERY_PARAMS.sort_field]: "date",
      [QUERY_PARAMS.sort_order]: "desc",
    },
    newParams: {
      [QUERY_PARAMS.filters]: JSON.stringify({
        op: "and",
        filters: [
          { field: "labels.value.id", op: "contains", value: "category::Law" },
          { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "law_type::Framework law", checked: true }] },
        ],
      }),
      [QUERY_PARAMS.sort]: "recent",
    },
  },
];
