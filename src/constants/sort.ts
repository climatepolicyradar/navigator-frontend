import { TSortOptionConfig, TSortValue } from "@/types";

import { EN_DASH } from "./chars";

export const SEARCH_SORT_OPTIONS: TSortOptionConfig[] = [
  { paramValue: "relevance", label: "Relevance" },
  { paramValue: "recent", label: "Most recent" },
  { paramValue: "oldest", label: "Oldest" },
  { paramValue: "title_asc", label: `A${EN_DASH}Z` },
  { paramValue: "title_desc", label: `Z${EN_DASH}A` },
];

export const PASSAGE_SORT_OPTIONS: TSortOptionConfig[] = [
  { paramValue: "relevance", label: "Relevance" },
  { paramValue: "page", label: "Page Number" },
];

export const SORT_PARAMS_LOOKUP: Record<TSortValue, string> = {
  relevance: "relevance desc",
  recent: "attributes.published_date desc",
  oldest: "attributes.published_date asc",
  title_asc: "title asc",
  title_desc: "title desc",
  page: "idx asc",
};
