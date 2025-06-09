import { ParsedUrlQuery } from "querystring";

import { QUERY_PARAMS } from "@/constants/queryParams";

export const getCurrentSearchChoice = (queryParams: ParsedUrlQuery) => {
  const exactMatch = queryParams[QUERY_PARAMS.exact_match];
  if (exactMatch === undefined) {
    return "true";
  }
  return exactMatch as string;
};
