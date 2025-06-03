import { RESULTS_PER_PAGE, PASSAGES_PER_DOC } from "@/constants/paging";
import { minYear, currentYear } from "@/constants/timedate";
import { TSearchCriteria } from "@/types";

export const initialSearchCriteria: TSearchCriteria = {
  concept_filters: [],
  corpus_import_ids: [],
  exact_match: false,
  keyword_filters: {},
  limit: 100,
  max_passages_per_doc: PASSAGES_PER_DOC,
  metadata: [],
  offset: 0,
  page_size: RESULTS_PER_PAGE,
  query_string: "",
  sort_field: null,
  sort_order: "desc",
  sort_within_page: false,
  year_range: [minYear.toString(), currentYear().toString()],
};
