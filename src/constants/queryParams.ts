import { TQueryStrings } from "@types";

export const QUERY_PARAMS: TQueryStrings = {
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
  // Multilater Climate Funds (MCF)
  fund: "fd",
  status: "st",
  implementing_agency: "ia",
  fund_type: "ft",
  // Laws and Policies
  framework_laws: "fl",
  topic: "tp",
  sector: "sc",
  // Reports
  author_type: "at",
};
