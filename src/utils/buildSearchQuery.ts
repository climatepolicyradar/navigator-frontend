import { initialSearchCriteria } from "@constants/searchCriteria";
import { QUERY_PARAMS } from "@constants/queryParams";
import { TSearchCriteria, TSearchKeywordFilters } from "@types";

export type TRouterQuery = {
  [key: string]: string | string[];
};

// We are storing the search object in the query using aliases
// This function converts the query string to the search object
export default function buildSearchQuery(routerQuery: TRouterQuery): TSearchCriteria {
  const keyword_filters: TSearchKeywordFilters = {};
  let query = { ...initialSearchCriteria };

  if (routerQuery[QUERY_PARAMS.query_string]) {
    query.query_string = routerQuery[QUERY_PARAMS.query_string]?.toString();
  }

  if (routerQuery[QUERY_PARAMS.exact_match]) {
    query.exact_match = routerQuery[QUERY_PARAMS.exact_match] === "true";
  }

  if (routerQuery[QUERY_PARAMS.offset]) {
    query.offset = Number(routerQuery[QUERY_PARAMS.offset]);
  }

  if (routerQuery[QUERY_PARAMS.sort_field]) {
    query.sort_field = routerQuery[QUERY_PARAMS.sort_field]?.toString();
  }

  if (routerQuery[QUERY_PARAMS.sort_order]) {
    query.sort_order = routerQuery[QUERY_PARAMS.sort_order]?.toString();
  }

  if (routerQuery[QUERY_PARAMS.year_range]) {
    const yearRange = routerQuery[QUERY_PARAMS.year_range];
    if (Array.isArray(yearRange)) {
      query.year_range = [Number(yearRange[0]), Number(yearRange[1])];
    }
  }

  if (routerQuery[QUERY_PARAMS.category]) {
    const qCategory = routerQuery[QUERY_PARAMS.category] as string;
    let category: string;
    if (["Legislation", "Law"].includes(qCategory)) {
      category = "Law";
    }
    if (["Policies", "Policy"].includes(qCategory)) {
      category = "Policy";
    }
    keyword_filters.categories = [category];
  }

  if (routerQuery[QUERY_PARAMS.region]) {
    const regions = routerQuery[QUERY_PARAMS.region];
    keyword_filters.regions = Array.isArray(regions) ? regions : [regions];
  }

  if (routerQuery[QUERY_PARAMS.country]) {
    const countries = routerQuery[QUERY_PARAMS.country];
    keyword_filters.countries = Array.isArray(countries) ? countries : [countries];
  }

  query = {
    ...query,
    keyword_filters,
  };
  return query;
}
