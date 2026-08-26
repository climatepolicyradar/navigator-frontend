import { parseAsString, useQueryState, useQueryStates } from "nuqs";
import { useCallback } from "react";

import { TNestedSearchLevel, TSearchLevel, TSearchLevelValues } from "@/types";
import { levelIdParamKey, searchLevelParsers, searchLevelUrlKeys } from "@/utils/search/searchLevels";

/** A level's search values, on the params that level owns. */
export const useSearchLevelValues = (level: TSearchLevel) => useQueryStates(searchLevelParsers, { urlKeys: searchLevelUrlKeys(level) });

/**
 * Manages the query state of the nested search levels: SERP -> Principal Drawer -> Document Drawer
 * Enables sharing links to open the drawer in the right place
 * The identity and the seeded search are written in the same tick, which nuqs
 * batches into a single URL update, so the level's search never renders half applied.
 */
export const useNestedSearchLevel = (level: TNestedSearchLevel) => {
  const [id, setId] = useQueryState(levelIdParamKey(level), parseAsString);
  const [search, setSearch] = useSearchLevelValues(level);

  const open = useCallback(
    (openId: string, seed: TSearchLevelValues) => {
      setId(openId, { history: "push" });
      setSearch(seed, { history: "push" });
    },
    [setId, setSearch]
  );

  const close = useCallback(() => {
    setId(null);
    setSearch(null);
  }, [setId, setSearch]);

  return { close, id, open, search };
};
