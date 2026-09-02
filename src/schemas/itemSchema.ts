import * as v from "valibot";

import { toLiteralUnion } from "@/utils/schemas/toLiteralUnion";

export const ITEM_TYPES = ["cdn", "source"] as const;
const ItemTypeSchema = toLiteralUnion(ITEM_TYPES);
export type TDataInItemType = v.InferOutput<typeof ItemTypeSchema>;
// "source" is not mandatory: litigation placeholder documents are published with a cdn item and no source url
// @related LITIGATION_PLACEHOLDER
export const MANDATORY_ITEM_TYPES: TDataInItemType[] = ["cdn"];

export const ItemSchema = v.object({
  url: v.string(),
  type: ItemTypeSchema,
  content_type: v.nullable(v.string()),
});
export type TDataInItem = v.InferOutput<typeof ItemSchema>;
