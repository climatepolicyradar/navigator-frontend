import { TThemeConfig, TThemePageMetadataKey } from "@/types";

export const getPageDescription = (themeConfig: TThemeConfig, metadataKey?: TThemePageMetadataKey, text?: string) => {
  if (!metadataKey) return "";
  const metadata = themeConfig.pageMetadata[metadataKey];
  return text ? metadata.description.replace("{text}", text) : metadata.description;
};
