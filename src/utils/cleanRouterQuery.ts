import { ParsedUrlQuery } from "querystring";

import { QUERY_PARAMS } from "@/constants/queryParams";

export const CleanRouterQuery = (query: ParsedUrlQuery) => {
  // remove any keys from router.query that are not values in QUERY_PARAMS
  Object.keys(query).forEach((key) => {
    if (!Object.values(QUERY_PARAMS).includes(key)) {
      delete query[key];
    }
  });

  return query;
};
