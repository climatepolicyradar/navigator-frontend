import { initialSearchCriteria } from "@constants/searchCriteria";
import { QUERY_PARAMS } from "@constants/queryParams";
import { TSearchCriteria, TSearchKeywordFilters } from "@types";

export type TRouterQuery = {
  [key: string]: string | string[];
};

// We are storing the search object in the query using aliases
// This function converts the query string to the search object
export default function buildSearchQuery(
  routerQuery: TRouterQuery,
  familyId = "",
  documentId = "",
  includeAllTokens = false,
  noOfPassagesPerDoc: number = undefined
): TSearchCriteria {
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
    if (["Legislation", "Law", "Legislative"].includes(qCategory)) {
      category = "Legislative";
    }
    if (["Policies", "Policy", "Executive"].includes(qCategory)) {
      category = "Executive";
    }
    if (["UNFCCC"].includes(qCategory)) {
      category = "UNFCCC";
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

  if (routerQuery[QUERY_PARAMS.active_continuation_token]) {
    // Array containing only 1 token - the active token
    query.continuation_tokens = [routerQuery[QUERY_PARAMS.active_continuation_token] as string];
  }

  if (includeAllTokens) {
    let allContinuationTokens: string[] = [];
    const routerQueryToken = routerQuery[QUERY_PARAMS.active_continuation_token] as string;
    const routerQueryTokens = routerQuery[QUERY_PARAMS.continuation_tokens] as string;
    if (routerQueryTokens) {
      const continuationTokens: string[] = JSON.parse(routerQueryTokens);
      if (Array.isArray(continuationTokens) && continuationTokens.length > 0) {
        allContinuationTokens.push(...continuationTokens);
      }
    }
    if (routerQueryToken) {
      if (!allContinuationTokens.includes(routerQueryToken)) {
        allContinuationTokens.push(routerQueryToken);
      }
    }
    query.continuation_tokens = allContinuationTokens;
  }

  if (familyId) {
    query.family_ids = [familyId];
    // Some query params are causing issues when we are on a family page
    query.offset = 0;
    // Clear continuation tokens
    query.continuation_tokens = [];
  }

  if (documentId) {
    query.document_ids = [documentId];
    // Some query params are causing issues when we are on a document page
    query.offset = 0;
    // Clear continuation tokens
    query.continuation_tokens = [];
  }

  if (noOfPassagesPerDoc) {
    // ensure that the number of passages per doc is a positive integer
    if (Number.isInteger(noOfPassagesPerDoc) && noOfPassagesPerDoc > 0) {
      query.max_passages_per_doc = noOfPassagesPerDoc;
    }
  }

  query = {
    ...query,
    keyword_filters,
  };
  return query;
}
