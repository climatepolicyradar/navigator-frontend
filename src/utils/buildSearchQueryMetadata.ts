import { TSearchCriteriaMeta, TThemeConfig } from "@/types";

export const buildSearchQueryMetadata = (
  metadata: TSearchCriteriaMeta[],
  metadataValue: string | string[],
  taxonomyKey: string,
  themeConfig: TThemeConfig,
  corpusIds?: string[]
) => {
  let metadataForApi: string[];
  let newMetadata: TSearchCriteriaMeta[] = [...metadata];
  // Find the relevant filter option for the given taxonomy key
  // If corpus IDs are passed in we need an additional check for the relevant corpus ID
  // If no corpus IDs are passed, or the filter does not have a category defined we can use the filter
  const filterOption = themeConfig.filters.find(
    (f) => f.taxonomyKey === taxonomyKey && (corpusIds?.some((c) => f.category.includes(c)) || !f.category || !corpusIds)
  );
  if (filterOption) {
    // remove existing metadata filters from the metadata
    newMetadata = newMetadata.filter((m) => m.name !== filterOption.apiMetaDataKey);
    if (Array.isArray(metadataValue)) {
      metadataForApi = metadataValue;
    } else {
      metadataForApi = [metadataValue];
    }
    metadataForApi.map((m) => {
      if (decodeURI(m).trim().length > 0) {
        newMetadata.push({
          name: filterOption.apiMetaDataKey,
          value: decodeURI(m),
        });
      }
    });
  }
  return newMetadata;
};
