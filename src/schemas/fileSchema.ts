import * as v from "valibot";

import { toLiteralUnion } from "@/utils/schemas/toLiteralUnion";

import { LabelSchema } from "./labelSchema";

export const FILE_ITEM_TYPES = ["cdn", "source"] as const;
const FileItemTypeSchema = toLiteralUnion(FILE_ITEM_TYPES);
export type TDataInFileItemType = v.InferOutput<typeof FileItemTypeSchema>;
export const MANDATORY_FILE_ITEM_TYPES: TDataInFileItemType[] = ["cdn", "source"];

const FileItemSchema = v.object({
  url: v.string(),
  type: FileItemTypeSchema,
  content_type: v.nullable(v.string()),
});

export type TDataInFileItem = v.InferOutput<typeof FileItemSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FileSchemaByType = (type: v.UnionSchema<any, any> | v.LiteralSchema<any, any>, attributes: v.ObjectSchema<any, any>) =>
  v.object({
    type,
    value: v.object({
      id: v.string(),
      title: v.string(),
      description: v.nullable(v.string()),
      items: v.array(FileItemSchema),
      labels: v.array(LabelSchema),
      attributes,
    }),
    timestamp: v.nullable(v.string()),
  });

export const FileSchema = v.union([
  // Documents
  FileSchemaByType(
    v.literal("has_member"),
    v.object({
      deprecated_slug: v.string(),
      md5_sum: v.optional(v.string()),
      variant: v.optional(v.string()),
      status: toLiteralUnion(["created", "deleted", "published"]),
    })
  ),
  // Collections
  FileSchemaByType(toLiteralUnion(["has_version", "member_of"]), v.object({})),
]);

export type TDataInFile = v.InferOutput<typeof FileSchema>;
