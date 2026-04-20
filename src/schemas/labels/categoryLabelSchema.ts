import * as v from "valibot";

import { DATA_IN_CATEGORY_VALUES } from "@/types";
import { toLiteralUnion } from "@/utils/schemas/toLiteralUnion";

import { TDataInLabel } from "../labelSchema";

export const CategoryLabelSchema = v.object({
  type: v.literal("category"),
  value: v.object({
    value: toLiteralUnion(DATA_IN_CATEGORY_VALUES),
  }),
});

export type TDataInCategoryLabel = v.InferOutput<typeof CategoryLabelSchema>;

export const validateCategoryLabel = (label: TDataInLabel): TDataInCategoryLabel => v.parse(CategoryLabelSchema, label);
