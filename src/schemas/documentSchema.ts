import * as v from "valibot";

import { FileSchema } from "./fileSchema";
import { LabelSchema } from "./labelSchema";

export const DocumentSchema = v.object({
  id: v.string(),
  title: v.string(),
  description: v.nullable(v.string()),
  documents: v.array(FileSchema),
  labels: v.array(LabelSchema),
  attributes: v.object({
    deprecated_slug: v.string(),
    last_updated_date: v.string(),
    published_date: v.string(),
  }),
});

export type TDataInDocument = v.InferOutput<typeof DocumentSchema>;

export const validateDataInDocument = (data: unknown): TDataInDocument => v.parse(DocumentSchema, data);
