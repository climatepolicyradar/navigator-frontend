import * as v from "valibot";

export const DocumentSchema = v.object({
  id: v.string(),
  title: v.string(),
  description: v.nullable(v.string()),
});

export type TDataInDocument = v.InferOutput<typeof DocumentSchema>;

export const validateDataInDocument = (data: unknown): TDataInDocument => v.parse(DocumentSchema, data);
