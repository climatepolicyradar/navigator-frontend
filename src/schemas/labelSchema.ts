import * as v from "valibot";

// Strictly validate label types so they reliably grouped and found later
export const LABEL_TYPES = [
  "activity_status",
  "category",
  "deprecated_category",
  "entity_type",
  "external_id",
  "framework",
  "geography",
  "hazard",
  "implementing_agency",
  "instrument",
  "keyword",
  "language",
  "legal_concept",
  "member_of",
  "project_status",
  "provider",
  "role",
  "sector",
  "status",
  "subconcept_of",
  "topic",
] as const;

// Allows Valibot to approve any string but type it as a string union for DX
// This prevents Valibot failing when new label types are introduced to the API and not yet listed above
const LabelTypeSchema = v.custom<(typeof LABEL_TYPES)[number]>((value) => typeof value === "string");
export type TDataInLabelType = v.InferOutput<typeof LabelTypeSchema>;

export const MANDATORY_DOCUMENT_LABEL_TYPES: TDataInLabelType[] = ["activity_status", "category", "provider"];
export const MANDATORY_FILE_LABEL_TYPES: TDataInLabelType[] = ["activity_status"];

export type TDataInLabel = {
  type: TDataInLabelType;
  value: {
    id: string;
    type: string;
    value: string;
    labels: TDataInLabel[];
    attributes?: Record<string, string>;
  };
  timestamp: string | null;
};

// Making changes? Update TDataInLabel to match
export const LabelSchema: v.GenericSchema<TDataInLabel> = v.object({
  type: LabelTypeSchema,
  value: v.object({
    id: v.string(),
    type: v.string(),
    value: v.string(),
    labels: v.array(v.lazy(() => LabelSchema)), // v.lazy allows for a recursive type. v.GenericSchema keeps TS happy
    attributes: v.optional(v.any()),
  }),
  timestamp: v.nullable(v.string()),
});
