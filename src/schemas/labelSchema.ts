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
  "organisation",
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

export const MANDATORY_LABEL_TYPES: TDataInLabelType[] = ["category", "organisation"];
export const MandatoryLabelsSchema = v.object(
  Object.fromEntries(
    MANDATORY_LABEL_TYPES.map((labelType) => [
      labelType,
      v.pipe(v.array(LabelSchema), v.minLength(1, `Expected document to have at least 1 label of type '${labelType}'`)),
    ])
  )
);
