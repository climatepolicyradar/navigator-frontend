import { ParsedUrlQuery } from "querystring";

import { QUERY_PARAMS } from "@/constants/queryParams";

export const getCurrentSortChoice = (queryParams: ParsedUrlQuery, isBrowsing: boolean) => {
  const field = queryParams[QUERY_PARAMS.sort_field];
  const order = queryParams[QUERY_PARAMS.sort_order];
  if (field === undefined && order === undefined) {
    if (isBrowsing) return "date:desc";
    return "relevance";
  }
  return `${field}:${order}`;
};
