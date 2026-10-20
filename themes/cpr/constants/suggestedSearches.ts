import { QUERY_PARAMS } from "@/constants/queryParams";
import { TSearchSuggestion } from "@/types";
import { deflateFilters } from "@/utils/filters/deflate";

const year = new Date().getUTCFullYear();

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
      [QUERY_PARAMS.filters]: deflateFilters({
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
      [QUERY_PARAMS.filters]: deflateFilters({
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
    label: "Zoning and spatial planning + marine",
    params: {
      [QUERY_PARAMS.concept_name]: "zoning and spatial planning",
      [QUERY_PARAMS.query_string]: "marine",
      [QUERY_PARAMS.exact_match]: "true",
    },
    newParams: {
      [QUERY_PARAMS.query_string]: "marine",
      [QUERY_PARAMS.filters]: deflateFilters({
        op: "or",
        filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q1282", checked: true }],
      }),
    },
  },
  {
    label: "Emissions reduction target",
    params: {},
    newParams: {
      [QUERY_PARAMS.filters]: deflateFilters({
        op: "and",
        filters: [
          { op: "or", filters: [{ field: "labels.value.id", op: "contains", value: "concept::Q1652", checked: true }] },
          { field: "attributes.published_date", key: "published_date", op: "gte", value: `${year - 1}-01-01T00:00:00.000Z` },
          { field: "attributes.published_date", key: "published_date", op: "lte", value: `${year}-12-31T23:59:59.999Z` },
        ],
      }),
    },
  },
];
