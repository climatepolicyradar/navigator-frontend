import * as v from "valibot";

import { TQueryGroup } from "@/components/_experiment/advancedFilters/AdvancedFilters";

export const FilterSchema = v.union([
  v.object({
    field: v.literal("labels.value.id"),
    op: v.picklist(["contains", "not_contains"]),
    value: v.string(),
  }),
  v.object({
    field: v.literal("attributes.published_date"),
    op: v.picklist(["between", "gte", "lte"]),
    value: v.string(),
  }),
]);

export const FilterGroupSchema: v.GenericSchema<TQueryGroup> = v.object({
  op: v.picklist(["and", "or"]),
  filters: v.array(v.union([FilterSchema, v.lazy(() => FilterGroupSchema)])),
});

export const FiltersSchema = FilterGroupSchema;
