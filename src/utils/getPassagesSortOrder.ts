import { ParsedUrlQuery } from "querystring";

import { QUERY_PARAMS } from "@/constants/queryParams";

export const getCurrentPassagesOrderChoice = (queryParams: ParsedUrlQuery) => {
  // TODO: remove this
  // Setting the default sort order to "sort_within_page" for a specific search with conditions:
  // - no search query
  // - with concepts/classifiers
  if (
    !queryParams[QUERY_PARAMS.passages_by_position] &&
    !queryParams[QUERY_PARAMS.query_string] &&
    (queryParams[QUERY_PARAMS.concept_id] || queryParams[QUERY_PARAMS.concept_name])
  )
    return true;
  return queryParams[QUERY_PARAMS.passages_by_position] === "true";
};
