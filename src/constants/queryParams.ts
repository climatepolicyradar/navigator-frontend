export const QUERY_PARAMS = {
  // Core
  query_string: "q",
  exact_match: "e",
  category: "c",
  region: "r",
  country: "l",
  year_range: "y",
  sort_field: "sf",
  sort_order: "so",
  offset: "o",
  active_continuation_token: "act",
  continuation_tokens: "cts",
  // Multilateral Climate Funds (MCF)
  fund: "fd",
  status: "st",
  implementing_agency: "ia",
  // Laws and Policies
  framework_laws: "fl",
  topic: "tp",
  sector: "sc",
  // Reports
  author_type: "at",
  // Pass through
  "concept_filters.id": "cfi",
  "concept_filters.name": "cfn",
} as const;
