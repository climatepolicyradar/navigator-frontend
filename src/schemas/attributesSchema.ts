import * as v from "valibot";

import { toLiteralUnion } from "@/utils/schemas/toLiteralUnion";

export const DISPLAY_ALLOWED_STATUSES = ["published", "awaiting_source_file"];

/* Generic */

// Using unknown for generic attributes prevents most properties from being stripped by v.validate
// Use more specific attribute schemas and validate methods below once certain of the document data type (e.g. family has_member = document)
export const AttributesSchema = v.unknown();
export type TDataInAttributes = v.InferOutput<typeof AttributesSchema>;

/* Specific */

export const FamilyAttributesSchema = v.object({
  action_taken: v.optional(v.string()),
  case_status: v.optional(v.string()),
  deprecated_slug: v.string(),
  "identifier::case_number": v.optional(v.string()),
  "identifier::project_id": v.optional(v.string()),
  "identifier::provider_id": v.optional(v.string()),
  last_updated_date: v.optional(v.string()),
  project_url: v.optional(v.string()),
  project_co_financing_usd: v.optional(v.number()),
  project_fund_spend_usd: v.optional(v.number()),
  published_date: v.string(),
});
export type TDataInFamilyAttributes = v.InferOutput<typeof FamilyAttributesSchema>;
export const validateFamilyAttributes = (attributes: TDataInAttributes): TDataInFamilyAttributes => v.parse(FamilyAttributesSchema, attributes);

export const DocumentAttributesSchema = v.pipe(
  v.object({
    action_taken: v.optional(v.string()),
    deprecated_slug: v.optional(v.string()),
    md5_sum: v.optional(v.string()),
    variant: v.optional(v.string()),
    status: toLiteralUnion(["created", "deleted", "published", "awaiting_source_file"]),
  }),
  v.forward(
    v.check(
      (input) => input.status === "awaiting_source_file" || input.deprecated_slug !== undefined,
      "deprecated_slug is required unless status is 'awaiting_source_file'."
    ),
    ["deprecated_slug"]
  )
);
export type TDataInDocumentAttributes = v.InferOutput<typeof DocumentAttributesSchema>;
export const validateDocumentAttributes = (attributes: TDataInAttributes): TDataInDocumentAttributes => v.parse(DocumentAttributesSchema, attributes);

export const CollectionAttributesSchema = v.object({
  deprecated_slug: v.string(),
});
export type TDataInCollectionAttributes = v.InferOutput<typeof CollectionAttributesSchema>;
export const validateCollectionAttributes = (attributes: TDataInAttributes): TDataInCollectionAttributes =>
  v.parse(CollectionAttributesSchema, attributes);
