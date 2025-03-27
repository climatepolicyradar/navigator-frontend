import { TSearchCriteriaMeta, TThemeConfig } from "@/types";

export const buildSearchQueryMetadata = (
  metadata: TSearchCriteriaMeta[],
  metadataValue: string | string[],
  taxonomyKey: string,
  themeConfig: TThemeConfig
) => {
  let metadataForApi: string[];
  let newMetadata: TSearchCriteriaMeta[] = [...metadata];
  const configMetadata = themeConfig.filters.find((f) => f.taxonomyKey === taxonomyKey);
  if (configMetadata) {
    // remove existing metadata filters from the metadata
    newMetadata = newMetadata.filter((m) => m.name !== configMetadata.apiMetaDataKey);
    if (Array.isArray(metadataValue)) {
      metadataForApi = metadataValue;
    } else {
      metadataForApi = [metadataValue];
    }
    metadataForApi.map((m) => {
      if (decodeURI(m).trim().length > 0) {
        newMetadata.push({ name: configMetadata.apiMetaDataKey, value: decodeURI(m) });
      }
    });
  }
  return newMetadata;
};
