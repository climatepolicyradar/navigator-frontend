import * as v from "valibot";

import { AttributesSchema, TDataInAttributes } from "./attributesSchema";
import { ItemSchema, TDataInItem } from "./itemSchema";
import { LabelSchema, TDataInLabel } from "./labelSchema";

// Making changes? Update both the TypeScript type and Valibot schema

export const DOCUMENT_RELATION_TYPES = [
  "member_of", // parent
  "has_member", // child
  "has_version",
] as const;
type TDataInDocumentRelationType = (typeof DOCUMENT_RELATION_TYPES)[number];
const DocumentRelationTypeSchema = v.union(DOCUMENT_RELATION_TYPES.map((type) => v.literal(type)));

export type TDataInDocumentRelation = {
  type: TDataInDocumentRelationType;
  value: Omit<TDataInDocument, "documents">;
};

export type TDataInDocument = {
  id: string;
  title: string;
  description: string | null;
  attributes: TDataInAttributes;
  labels: TDataInLabel[];
  documents?: TDataInDocumentRelation[];
  items?: TDataInItem[];
};

// Making changes? Update TDataInDocument to match
export const DocumentSchema: v.GenericSchema<TDataInDocument> = v.object({
  id: v.string(),
  title: v.string(),
  description: v.nullable(v.string()),
  attributes: AttributesSchema,
  labels: v.array(LabelSchema),
  documents: v.optional(
    v.array(
      v.object({
        type: DocumentRelationTypeSchema,
        value: v.lazy(() => DocumentSchema),
      })
    )
  ),
  items: v.optional(v.array(ItemSchema)),
});

export const validateDataInDocument = (data: unknown): TDataInDocument => v.parse(DocumentSchema, data);
