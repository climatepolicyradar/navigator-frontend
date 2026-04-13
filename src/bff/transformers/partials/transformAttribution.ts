import { getTaxonomy } from "@/bff/methods/getTaxonomy";
import { TDataInLabel, TDataInLabelType, validateProviderLabel } from "@/schemas";
import { TAttributionCategory, TFamilyAttribution } from "@/types";
import { TItemsByType } from "@/utils/data-in/groupByType";

export const transformAttribution = (groupedLabels: TItemsByType<TDataInLabel, TDataInLabelType>): TFamilyAttribution => {
  const label = groupedLabels.provider.find((label) => label.value.type === "agent");
  const providerLabel = validateProviderLabel(label);

  const attribution: TFamilyAttribution = {
    category: groupedLabels.category[0].value.value as TAttributionCategory,
    corpusImageAlt: providerLabel.value.value ?? "No corpus image found",
    corpusNote: providerLabel.value.attributes.corpus_text ?? "No corpus note found",
    provider: providerLabel.value.value,
    taxonomy: getTaxonomy(
      groupedLabels.category[0].value.value.toLowerCase() as Lowercase<TAttributionCategory>,
      groupedLabels.provider[0].value.value
    ),
  };

  if (providerLabel.value.attributes.corpus_image_url) {
    attribution.corpusImage = providerLabel.value.attributes.corpus_image_url;
  }
  if (providerLabel.value.attributes.attribution_url) {
    attribution.url = providerLabel.value.attributes.attribution_url;
  }

  return attribution;
};
