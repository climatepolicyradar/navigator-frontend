import * as v from "valibot";

// TODO type these out as they become necessary for transformations
export const LabelLabelSchema = v.unknown();
export const LabelDocumentSchema = v.unknown();

export const LabelSchema = v.object({
  type: v.string(),
  value: v.object({
    id: v.string(),
    type: v.string(),
    value: v.string(),
    labels: v.array(LabelLabelSchema),
    documents: v.array(LabelDocumentSchema),
  }),
  timestamp: v.nullable(v.string()),
});
