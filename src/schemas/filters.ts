import * as v from "valibot";

import { TSearchQueryGroup } from "@/types";

export const FilterSchema = v.union([
  v.object({
    field: v.literal("labels.value.id"),
    op: v.picklist(["contains", "not_contains"]),
    value: v.string(),
  }),
  v.object({
    field: v.literal("attributes.published_date"),
    key: v.literal("published_date"),
    op: v.picklist(["eq", "not_eq", "lt", "lte", "gt", "gte"]),
    value: v.string(),
  }),
]);

export const FilterGroupSchema: v.GenericSchema<TSearchQueryGroup> = v.object({
  op: v.picklist(["and", "or"]),
  filters: v.array(v.union([FilterSchema, v.lazy(() => FilterGroupSchema)])),
});

export const FiltersSchema = FilterGroupSchema;
