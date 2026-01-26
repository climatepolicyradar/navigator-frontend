import { ParsedUrlQuery } from "querystring";

import { NextRouter } from "next/router";

import { QUERY_PARAMS } from "@/constants/queryParams";

export const triggerNewSearch = (router: NextRouter, term: string, filter?: string, filterValue?: string) => {
  const newQuery: ParsedUrlQuery = {};
  if (term && term !== "") {
    newQuery[QUERY_PARAMS.query_string] = term;
  } else {
    delete router.query[QUERY_PARAMS.query_string];
  }
  if (filter && filterValue && filter.length && filterValue.length) {
    newQuery[filter] = [filterValue.toLowerCase()];
  }
  // Preserve exact_match parameter if it exists (both true and false)
  if (router.query[QUERY_PARAMS.exact_match] !== undefined) {
    newQuery[QUERY_PARAMS.exact_match] = router.query[QUERY_PARAMS.exact_match];
  }
  router.push({ pathname: "/search", query: { ...newQuery } });
};
