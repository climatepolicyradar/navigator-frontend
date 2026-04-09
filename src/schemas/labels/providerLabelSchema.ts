import * as v from "valibot";

export const ProviderLabelSchema = v.object({
  type: v.literal("provider"),
  value: v.object({
    id: v.string(),
    type: v.literal("agent"),
    value: v.string(),
    attributes: v.object({
      attribution_url: v.pipe(v.string(), v.url()),
      corpus_text: v.string(),
      corpus_image_url: v.pipe(v.string(), v.url()),
    }),
  }),
});

export type TDataInProviderLabel = v.InferOutput<typeof ProviderLabelSchema>;

export const validateProviderLabel = (data: unknown): TDataInProviderLabel => v.parse(ProviderLabelSchema, data);
