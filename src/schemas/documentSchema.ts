import * as v from "valibot";

import { LabelSchema } from "./labelSchema";
import { MediaSchema } from "./mediaSchema";

export const DocumentSchema = v.object({
  id: v.string(),
  title: v.string(),
  description: v.nullable(v.string()),
  labels: v.array(LabelSchema),
  documents: v.array(MediaSchema),
});

export type TDataInDocument = v.InferOutput<typeof DocumentSchema>;

export const validateDataInDocument = (data: unknown): TDataInDocument => v.parse(DocumentSchema, data);
