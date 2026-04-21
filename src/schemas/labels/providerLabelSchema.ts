import * as v from "valibot";

import { TDataInLabel } from "../labelSchema";

export const ProviderLabelSchema = v.object({
  type: v.literal("provider"),
  value: v.object({
    id: v.string(),
    type: v.literal("agent"),
    value: v.string(),
    attributes: v.object({
      attribution_url: v.optional(v.string()),
      corpus_text: v.optional(v.string()),
      corpus_image_url: v.optional(v.string()),
    }),
  }),
});

export type TDataInProviderLabel = v.InferOutput<typeof ProviderLabelSchema>;

export const validateProviderLabel = (label: TDataInLabel): TDataInProviderLabel => v.parse(ProviderLabelSchema, label);
