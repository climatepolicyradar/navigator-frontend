export type TQueryStrings = {
  // Core
  query_string: string;
  exact_match: string;
  region: string;
  country: string;
  category: string;
  year_range: string;
  sort_field: string;
  sort_order: string;
  offset: string;
  active_continuation_token: string;
  continuation_tokens: string;
  // Multilateral Climate Funds (MCF)
  fund: string;
  status: string;
  implementing_agency: string;
  // Laws and Policies
  framework_laws: string;
  topic: string;
  sector: string;
  // Reports
  author_type: string;
};
