import { NextRouter } from "next/router";

import { QUERY_PARAMS } from "@/constants/queryParams";

export const triggerNewSearch = (router: NextRouter, term: string, filter?: string, filterValue?: string) => {
  const newQuery = {};
  if (term && term !== "") {
    newQuery[QUERY_PARAMS.query_string] = term;
  } else {
    delete router.query[QUERY_PARAMS.query_string];
  }
  if (filter && filterValue && filter.length && filterValue.length) {
    newQuery[filter] = [filterValue.toLowerCase()];
  }
  if (router.query[QUERY_PARAMS.exact_match] === "true") {
    newQuery[QUERY_PARAMS.exact_match] = "true";
  }
  router.push({ pathname: "/search", query: { ...newQuery } });
};
