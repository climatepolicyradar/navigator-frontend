import { COMMON_DOCUMENT_TYPE_LABELS, getDocumentTypeLabel } from "@/bff/methods/getDocumentTypeLabel";
import { TDataInLabel, validateProviderLabel } from "@/schemas";
import themeConfig from "@/themes/config";
import { TAttributionCategory, TFamilyAttribution } from "@/types";

export const transformAttribution = (labels: TDataInLabel[]): TFamilyAttribution => {
  const label = labels.find((label) => label.type === "provider" && label.value.type === "agent");
  const providerLabel = validateProviderLabel(label);
  const categoryLabel = labels.find((label) => label.type === "category");

  const attribution: TFamilyAttribution = {
    category: categoryLabel.value.value as TAttributionCategory,
    corpusImageAlt: providerLabel.value.value ?? "",
    corpusNote: providerLabel.value.attributes.corpus_text ?? "",
    provider: providerLabel.value.value,
    taxonomy: getDocumentTypeLabel(
      labels.map((label) => label.value),
      [...(themeConfig.documentTypeLabels ?? []), ...COMMON_DOCUMENT_TYPE_LABELS]
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
