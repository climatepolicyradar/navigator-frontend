import * as v from "valibot";

import { toLiteralUnion } from "@/utils/schemas/toLiteralUnion";

/* Generic */

// Using unknown for generic attributes prevents most properties from being stripped by v.validate
// Use more specific attribute schemas and validate methods below once certain of the document data type (e.g. family has_member = document)
export const AttributesSchema = v.unknown();
export type TDataInAttributes = v.InferOutput<typeof AttributesSchema>;

/* Specific */

export const FamilyAttributesSchema = v.object({
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

export const DocumentAttributesSchema = v.object({
  deprecated_slug: v.string(),
  md5_sum: v.optional(v.string()),
  variant: v.optional(v.string()),
  status: toLiteralUnion(["created", "deleted", "published"]),
});
export type TDataInDocumentAttributes = v.InferOutput<typeof DocumentAttributesSchema>;
export const validateDocumentAttributes = (attributes: TDataInAttributes): TDataInDocumentAttributes => v.parse(DocumentAttributesSchema, attributes);

export const CollectionAttributesSchema = v.object({
  deprecated_slug: v.string(),
});
export type TDataInCollectionAttributes = v.InferOutput<typeof CollectionAttributesSchema>;
export const validateCollectionAttributes = (attributes: TDataInAttributes): TDataInCollectionAttributes =>
  v.parse(CollectionAttributesSchema, attributes);
