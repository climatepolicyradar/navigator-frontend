import * as v from "valibot";

// Strictly validate label types so they reliably grouped and found later
export const LABEL_TYPES = [
  "activity_status",
  "category",
  "entity_type",
  "external_id",
  "framework",
  "geography",
  "hazard",
  "instrument",
  "keyword",
  "language",
  "provider",
  "role",
  "sector",
  "status",
  "topic",
] as const;

// Allows Valibot to approve any string but type it as a string union for DX
// This prevents Valibot failing when new label types are introduced to the API and not yet listed above
const LabelTypeSchema = v.custom<(typeof LABEL_TYPES)[number]>((value) => typeof value === "string");
export type TDataInLabelType = v.InferOutput<typeof LabelTypeSchema>;

export const MANDATORY_FAMILY_LABEL_TYPES: TDataInLabelType[] = ["category", "provider"];

// TODO type these out as they become necessary for transformations
export const LabelLabelSchema = v.unknown();
export const LabelDocumentSchema = v.unknown();

export const LabelSchema = v.object({
  type: LabelTypeSchema,
  value: v.object({
    id: v.string(),
    type: v.string(),
    value: v.string(),
    labels: v.array(LabelLabelSchema),
    documents: v.array(LabelDocumentSchema),
  }),
  timestamp: v.nullable(v.string()),
});

export type TDataInLabel = v.InferOutput<typeof LabelSchema>;
