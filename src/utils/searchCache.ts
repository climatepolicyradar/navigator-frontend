import { TMatchedFamily, TSearchKeywordFilters } from "@types";
import { arrayOfStringdMatch } from "./arrayEquality";
import { CACHE_NAME, CACHE_LIMIT, CACHE_EXPIRY } from "@constants/cache";

const arrayStringMatchChecker = (a?: string[] | null, b?: string[] | null) => {
  let result = false;
  if (!a && !b) {
    result = true;
  }
  if (a && b) {
    if (a.length === b.length) {
      a.sort();
      b.sort();
      result = a.every((val, index) => val === b[index]);
    }
  }
  return result;
};

export type TCacheIdentifier = {
  query_string: string;
  exact_match: boolean;
  keyword_filters?: TSearchKeywordFilters;
  year_range: [number, number];
  sort_field: string | null;
  sort_order: string;
  offset: number;
  family_ids?: string[] | null;
  document_ids?: string[] | null;
};

export type TCacheResult = TCacheIdentifier & {
  families: TMatchedFamily[];
  hits: number;
  timestamp: number;
};

type TCacheSearch = {
  cache: TCacheResult[];
};

const getCache = (): TCacheSearch => {
  const cachedSearch = window.localStorage.getItem(CACHE_NAME);
  return cachedSearch === null || undefined ? { cache: [] } : JSON.parse(cachedSearch);
};

const saveCache = (newCache: TCacheSearch) => {
  window.localStorage.setItem(CACHE_NAME, JSON.stringify(newCache));
};

const clearOldCache = () => {
  const cache = getCache();
  const newCache = {
    cache: cache.cache.filter((search) => search.timestamp > Date.now() - CACHE_EXPIRY),
  };
  saveCache(newCache);
};

export const getCachedSearch = (cacheId: TCacheIdentifier) => {
  clearOldCache();
  const cache = getCache();
  const { query_string, exact_match, keyword_filters, year_range, sort_field, sort_order, offset } = cacheId;
  const cachedSearch = cache.cache.find(
    (search) =>
      search.query_string === query_string &&
      search.exact_match === exact_match &&
      arrayOfStringdMatch(search.keyword_filters?.categories, keyword_filters?.categories) &&
      arrayOfStringdMatch(search.keyword_filters?.countries, keyword_filters?.countries) &&
      arrayOfStringdMatch(search.keyword_filters?.regions, keyword_filters?.regions) &&
      search.year_range[0] === year_range[0] &&
      search.year_range[1] === year_range[1] &&
      search.sort_field === sort_field &&
      search.sort_order === sort_order &&
      search.offset === offset &&
      arrayStringMatchChecker(search.family_ids, cacheId.family_ids) &&
      arrayStringMatchChecker(search.document_ids, cacheId.document_ids)
  );
  return cachedSearch;
};

export const updateCacheSearch = (search: TCacheResult) => {
  // don't cache empty results
  if (search.families.length === 0) return;
  if (getCachedSearch(search) !== undefined) return;
  const cache = getCache();
  if (cache.cache.length > CACHE_LIMIT) {
    cache.cache.pop();
  }
  const newCache = {
    cache: [search, ...cache.cache],
  };
  saveCache(newCache);
};
