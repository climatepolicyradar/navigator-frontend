import * as v from "valibot";

import { TQueryGroup } from "@/components/_experiment/queryBuilder/QueryBuilder";

export const FilterSchema = v.object({
  field: v.picklist(["labels.value.id"]),
  op: v.picklist(["contains", "not_contains"]),
  value: v.string(),
});

export const FilterGroupSchema: v.GenericSchema<TQueryGroup> = v.object({
  op: v.picklist(["and", "or"]),
  filters: v.array(v.union([FilterSchema, v.lazy(() => FilterGroupSchema)])),
});

export const FiltersSchema = FilterGroupSchema;
