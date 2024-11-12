import { TThemeConfig } from "@types";

export const getPageTitle = (themeConfig?: TThemeConfig, metadataKey?: string) => {
  let title = "";
  if (metadataKey && themeConfig) {
    title = themeConfig.metadata.find((meta) => meta.key === metadataKey)?.title ?? "";
  }
  return title;
};
