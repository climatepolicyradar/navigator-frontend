import { deflateSync, inflateSync, strFromU8, strToU8 } from "fflate";
import { createParser, parseAsJson } from "nuqs";

import { FilterGroupSchema } from "@/schemas";
import { TSearchQueryGroup } from "@/types";

export function deflateFilters(filters: TSearchQueryGroup): string {
  const binary = strFromU8(deflateSync(strToU8(JSON.stringify(filters))), true);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function inflateFilters(encoded: string): string {
  const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
  return strFromU8(inflateSync(strToU8(binary, true)));
}

const parseAsJsonFilters = parseAsJson<TSearchQueryGroup>(FilterGroupSchema);

export const parseAsDeflatedFilters = createParser({
  parse: (value: string) => parseAsJsonFilters.parse(value.startsWith("{") ? value : inflateFilters(value)),
  serialize: deflateFilters,
  eq: parseAsJsonFilters.eq,
});
