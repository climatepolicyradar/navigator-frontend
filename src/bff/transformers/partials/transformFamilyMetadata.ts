import { API_FAMILY_METADATA_KEY, TApiFamilyMetadata, TApiFamilyMetadataKey } from "@/types";
import { TLabelsByType } from "@/utils/labels/groupLabelsByType";

const isFamilyMetadataKey = (string: string): string is TApiFamilyMetadataKey => API_FAMILY_METADATA_KEY.includes(string as TApiFamilyMetadataKey);

export const transformFamilyMetadata = (groupedLabels: TLabelsByType): TApiFamilyMetadata => {
  const familyMetadata: TApiFamilyMetadata = {};

  Object.entries(groupedLabels).forEach(([labelType, labels]) => {
    if (isFamilyMetadataKey(labelType)) {
      familyMetadata[labelType] = labels.map((label) => label.value.value);
    }
  });

  return familyMetadata;
};
