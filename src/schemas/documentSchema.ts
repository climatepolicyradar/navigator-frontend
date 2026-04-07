import * as v from "valibot";

import { FileSchema } from "./fileSchema";
import { LabelSchema } from "./labelSchema";

const AttributesSchema = v.object({
  deprecated_slug: v.string(),
  "identifier::project_id": v.optional(v.string()),
  last_updated_date: v.string(),
  project_url: v.optional(v.string()),
  project_co_financing_usd: v.optional(v.number()),
  project_fund_spend_usd: v.optional(v.number()),
  published_date: v.string(),
});
export type TDataInDocumentAttributes = v.InferOutput<typeof AttributesSchema>;

export const DocumentSchema = v.object({
  id: v.string(),
  title: v.string(),
  description: v.nullable(v.string()),
  documents: v.array(FileSchema),
  labels: v.array(LabelSchema),
  attributes: AttributesSchema,
});

export type TDataInDocument = v.InferOutput<typeof DocumentSchema>;

export const validateDataInDocument = (data: unknown): TDataInDocument => v.parse(DocumentSchema, data);
