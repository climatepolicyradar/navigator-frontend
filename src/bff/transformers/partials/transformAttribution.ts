import { TDataInLabel, TDataInLabelType, validateProviderLabel } from "@/schemas";
import { TFamilyAttribution } from "@/types";
import { TItemsByType } from "@/utils/data-in/groupByType";

export const transformAttribution = (groupedLabels: TItemsByType<TDataInLabel, TDataInLabelType>): TFamilyAttribution => {
  const label = groupedLabels.provider.find((label) => label.value.type === "agent");
  const providerLabel = validateProviderLabel(label);

  return {
    corpusImage: providerLabel.value.attributes.corpus_image_url,
    corpusImageAlt: providerLabel.value.value,
    corpusNote: providerLabel.value.attributes.corpus_text,
    url: providerLabel.value.attributes.attribution_url,
  };
};
