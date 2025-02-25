import { minYear, currentYear } from "@constants/timedate";
import { RESULTS_PER_PAGE, PASSAGES_PER_DOC } from "@constants/paging";
import { TSearchCriteria } from "@types";

export const initialSearchCriteria: TSearchCriteria = {
  query_string: "",
  exact_match: false,
  max_passages_per_doc: PASSAGES_PER_DOC,
  keyword_filters: {},
  year_range: [minYear.toString(), currentYear().toString()],
  sort_field: null,
  sort_order: "desc",
  page_size: RESULTS_PER_PAGE,
  limit: 100,
  offset: 0,
  corpus_import_ids: [],
  metadata: [],
  concept_filters: {},
};
