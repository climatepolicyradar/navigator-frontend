import { createContext } from "react";

import { TSearchLevel } from "@/utils/search/searchLevels";

/**
 * The search level the subtree belongs to, which decides the URL params its controls read and
 * write. Drawers provide the level they own; everything else searches at the page's own level.
 */
export const SearchLevelContext = createContext<TSearchLevel>("base");
