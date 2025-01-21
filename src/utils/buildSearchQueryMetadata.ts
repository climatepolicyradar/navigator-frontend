import { TSearchCriteria, TThemeConfig } from "@types";

export const buildSearchQueryMetadata = (
  query: TSearchCriteria,
  metadataValue: string | string[],
  taxonomyKey: string,
  themeConfig: TThemeConfig
) => {
  let metadataForApi: string[];
  const configMetadata = themeConfig.filters.find((f) => f.taxonomyKey === taxonomyKey);
  if (configMetadata) {
    // remove existing metadata filters from the metadata
    query.metadata = query.metadata.filter((m) => m.name !== configMetadata.apiMetaDataKey);
    if (Array.isArray(metadataValue)) {
      metadataForApi = metadataValue;
    } else {
      metadataForApi = [metadataValue];
    }
    metadataForApi.map((m) => {
      query.metadata.push({ name: configMetadata.apiMetaDataKey, value: decodeURI(m) });
    });
  }
  return null;
};
