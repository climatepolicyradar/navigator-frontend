import * as v from "valibot";

import { LabelSchema } from "./labelSchema";

export const FILE_ITEM_TYPES = ["cdn", "source"] as const;
const FileItemTypeSchema = v.union(FILE_ITEM_TYPES.map((type) => v.literal(type)));
export type TDataInFileItemType = v.InferOutput<typeof FileItemTypeSchema>;
export const MANDATORY_FILE_ITEM_TYPES: TDataInFileItemType[] = ["cdn", "source"];

const FileItemSchema = v.object({
  url: v.string(),
  type: FileItemTypeSchema,
  content_type: v.nullable(v.string()),
});

export type TDataInFileItem = v.InferOutput<typeof FileItemSchema>;

export const FileSchema = v.object({
  type: v.union([v.literal("has_member"), v.literal("has_version")]),
  value: v.object({
    id: v.string(),
    title: v.string(),
    description: v.nullable(v.string()),
    items: v.array(FileItemSchema),
    labels: v.array(LabelSchema),
    attributes: v.object({
      deprecated_slug: v.string(),
      languages: v.pipe(v.array(v.string()), v.minLength(1)),
    }),
  }),
  timestamp: v.nullable(v.string()),
});

export type TDataInFile = v.InferOutput<typeof FileSchema>;
