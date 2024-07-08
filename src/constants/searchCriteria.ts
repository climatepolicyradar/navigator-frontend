import { minYear, currentYear } from "@constants/timedate";
import { RESULTS_PER_PAGE } from "@constants/paging";
import { TSearchCriteria } from "@types";

export const initialSearchCriteria: TSearchCriteria = {
  query_string: "",
  exact_match: false,
  max_passages_per_doc: 5,
  keyword_filters: {},
  year_range: [minYear, currentYear()],
  sort_field: null,
  sort_order: "desc",
  page_size: RESULTS_PER_PAGE,
  limit: 100,
  offset: 0,
};
