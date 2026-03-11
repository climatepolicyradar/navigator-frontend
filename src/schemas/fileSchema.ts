import * as v from "valibot";

import { LabelSchema } from "./labelSchema";

const ItemSchema = v.object({
  url: v.string(),
  type: v.string(),
  content_type: v.nullable(v.string()),
});

export const FileSchema = v.object({
  type: v.union([v.literal("has_member"), v.literal("has_version")]),
  value: v.object({
    id: v.string(),
    title: v.string(),
    description: v.nullable(v.string()),
    items: v.array(ItemSchema),
    labels: v.array(LabelSchema),
  }),
  timestamp: v.nullable(v.string()),
});

export type TDataInFile = v.InferOutput<typeof FileSchema>;
