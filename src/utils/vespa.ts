import { TFamilyMetadata, TVespaMetadata } from "@/types";

export function transformVespaMetadataToFamilyMetadata(vespaMetadata: TVespaMetadata): TFamilyMetadata {
  return vespaMetadata.reduce((acc, curr) => {
    /**
     * VespaMetadata is prefixed with `family.` or `document.`
     * TODO: validate if we want to keep these prefixes. For now we remove them for the smallest refactor.
     */
    const key: keyof TFamilyMetadata = curr.name.replace("family.", "").replace("document.", "") as keyof TFamilyMetadata;
    if (acc[key]) {
      acc[key] = [...acc[key], curr.value];
    } else {
      acc[key] = [curr.value];
    }
    return acc;
  }, {} as TFamilyMetadata);
}
