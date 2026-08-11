import { TSortOptionConfig } from "@/types";

import { EN_DASH } from "./chars";

export const SEARCH_SORT_OPTIONS: TSortOptionConfig[] = [
  { paramValue: "relevance", label: "Relevance" },
  { paramValue: "recent", label: "Most recent" },
  { paramValue: "oldest", label: "Oldest" },
  { paramValue: "title_asc", label: `A${EN_DASH}Z` },
  { paramValue: "title_desc", label: `Z${EN_DASH}A` },
];

export const PASSAGE_SORT_OPTIONS: TSortOptionConfig[] = [
  { paramValue: "relevance desc", label: "Relevance" },
  { paramValue: "idx asc", label: "Page Number" },
];
