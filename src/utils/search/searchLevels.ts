import { parseAsArrayOf, parseAsJson, parseAsString } from "nuqs";
import type { UrlKeys } from "nuqs";

import { QUERY_PARAMS } from "@/constants/queryParams";
import { FilterGroupSchema } from "@/schemas";
import { TNestedSearchLevel, TSearchLevel, TSearchLevelValues, TSearchParamKeys, TSearchQueryGroup } from "@/types";

import { filterQueryGroupRules, isLabelRuleOfTypes } from "./filterQueryGroupRules";

/**
 * Nested drawers within search need to be scoped to their own search
 * Transfer of filters goes: SERP -> Principal -> Document
 * Filters do not transfer back up, i.e. these arrows above are strictly one-way
 */

export const SORT_PARAM_KEY = "sort";
export const PAGE_TOKEN_PARAM_KEY = "page_token";
export const TOPIC_PARAM_KEY = "topic";

const BASE_PARAM_KEYS: TSearchParamKeys = {
  documents: QUERY_PARAMS.documents,
  filters: QUERY_PARAMS.filters,
  pageToken: PAGE_TOKEN_PARAM_KEY,
  query: QUERY_PARAMS.query_string,
  sort: SORT_PARAM_KEY,
};

// Nested levels namespace the base keys. They are deliberately absent from QUERY_PARAMS so that
// CleanRouterQuery strips them from any link leaving the page
export const levelParamKeys = (level: TSearchLevel): TSearchParamKeys => {
  if (level === "base") return BASE_PARAM_KEYS;

  return {
    documents: `${level}_${BASE_PARAM_KEYS.documents}`,
    filters: `${level}_${BASE_PARAM_KEYS.filters}`,
    pageToken: `${level}_${BASE_PARAM_KEYS.pageToken}`,
    query: `${level}_${BASE_PARAM_KEYS.query}`,
    sort: `${level}_${BASE_PARAM_KEYS.sort}`,
  };
};

/**
 * Manage the parsing of the search levels
 * Generally we need to be careful we are only changing the level the user is focusing on
 */
export const searchLevelParsers = {
  documents: parseAsArrayOf(parseAsString),
  filters: parseAsJson<TSearchQueryGroup>(FilterGroupSchema),
  query: parseAsString,
  sort: parseAsString,
};

export const searchLevelUrlKeys = (level: TSearchLevel): UrlKeys<typeof searchLevelParsers> => {
  const keys = levelParamKeys(level);

  return { documents: keys.documents, filters: keys.filters, query: keys.query, sort: keys.sort };
};

export const levelIdParamKey = (level: TNestedSearchLevel): string => level;

export const SEARCH_PATH = "_search";

/**
 * The level a page view is looking at, for analytics. Left undefined away from the results page, so
 * a plain results view stays distinguishable from a page that has no search levels at all.
 */
export const searchLevelFromParams = (pathname: string, searchParams: URLSearchParams): TSearchLevel | undefined => {
  if (pathname.split("/")[1] !== SEARCH_PATH) return undefined;
  if (searchParams.get(levelIdParamKey("document"))) return "document";
  if (searchParams.get(levelIdParamKey("principal"))) return "principal";
  return "base";
};

export const conceptFiltersOnly = (filters: TSearchQueryGroup | null): TSearchQueryGroup | null =>
  filterQueryGroupRules(filters, isLabelRuleOfTypes(["concept"]));

type TSeedSource = {
  filters?: TSearchQueryGroup | null;
  query?: string | null;
  // Only carry sort between passage search levels, not main search
  sort?: string | null;
};

/**
 * We don't want to bring across everything from the document search to passage search
 */
export const seedPassageLevel = ({ filters = null, query = null, sort = null }: TSeedSource): TSearchLevelValues => ({
  documents: null,
  filters: conceptFiltersOnly(filters),
  query: query || null, // cleanses an empty string
  sort: sort || null,
});

/**
 * When navigating to a Principal or Document page we want to preserve the filters
 * from the drawer and apply to the page as the base/main query
 */
export const flattenLevelToBaseQuery = ({
  documents,
  filters,
  query,
}: Pick<TSearchLevelValues, "documents" | "filters" | "query">): Record<string, string | null> => ({
  [BASE_PARAM_KEYS.documents]: documents?.length ? documents.join(",") : null,
  [BASE_PARAM_KEYS.filters]: filters ? JSON.stringify(filters) : null,
  [BASE_PARAM_KEYS.query]: query || null,
});
