import { parseAsArrayOf, parseAsJson, parseAsString } from "nuqs";
import type { UrlKeys } from "nuqs";
import * as v from "valibot";

import { QUERY_PARAMS } from "@/constants/queryParams";
import { TDateRange } from "@/context/FiltersContext";
import { FilterGroupSchema } from "@/schemas";
import { TNestedSearchLevel, TSearchLevel, TSearchLevelValues, TSearchParamKeys, TSearchQueryGroup, TSearchQueryRule, isRule } from "@/types";

import { filterQueryGroupRules, isLabelRuleOfTypes } from "./filterQueryGroupRules";
import { queryGroupToFilterPaths } from "./queryGroupToFilterPaths";

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

// Any group left after pruning to concept-only rules relates concept filters to one another,
// so we widen it to OR: a passage should surface if it matches any of the selected concepts
const groupToOr = (node: TSearchQueryGroup | TSearchQueryRule): TSearchQueryGroup | TSearchQueryRule =>
  isRule(node) ? node : { ...node, op: "or", filters: node.filters.map(groupToOr) };

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

type TFilterPaths = ReturnType<typeof queryGroupToFilterPaths>;
const NO_FILTERS: TFilterPaths = { filterPathLabels: [], dateRange: null };

const readFilters = (raw: string | null): TFilterPaths => {
  try {
    const parsed = raw ? v.safeParse(FilterGroupSchema, JSON.parse(raw)) : null;
    if (!parsed?.success || !parsed.output.filters.length) return NO_FILTERS;
    return queryGroupToFilterPaths(parsed.output);
  } catch {
    return NO_FILTERS;
  }
};

type TSearchProperties = {
  search_query?: string;
  sort?: string;
  page?: number;
  filters_applied?: string[];
  filters_count?: number;
  filter_types?: string[];
  date_range?: TDateRange;
};

/**
 * The search a page view is looking at, as properties, so analysis does not have to decode the
 * filters JSON out of the URL. Read from the level the user is focused on, and absent while a
 * control is at its default, so a value present is a value chosen.
 */
export const searchPropertiesFromParams = (pathname: string, searchParams: URLSearchParams): TSearchProperties => {
  const level = searchLevelFromParams(pathname, searchParams);
  if (!level) return {};

  const keys = levelParamKeys(level);
  const query = searchParams.get(keys.query);
  const sort = searchParams.get(keys.sort);
  const page = Number(searchParams.get(keys.pageToken));
  const { filterPathLabels, dateRange } = readFilters(searchParams.get(keys.filters));
  const labels = [...new Map(filterPathLabels.flat().map((label) => [label.id, label])).values()];

  return {
    search_query: query || undefined,
    sort: sort || undefined,
    page: Number.isInteger(page) && page > 1 ? page : undefined,
    filters_applied: labels.length ? labels.map((label) => label.id) : undefined,
    filters_count: labels.length,
    filter_types: labels.length ? [...new Set(labels.map((label) => label.type))] : undefined,
    date_range: dateRange ?? undefined,
  };
};

export const conceptFiltersOnly = (filters: TSearchQueryGroup | null): TSearchQueryGroup | null => {
  const conceptFilters = filterQueryGroupRules(filters, isLabelRuleOfTypes(["concept"]));
  return conceptFilters && (groupToOr(conceptFilters) as TSearchQueryGroup);
};

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
