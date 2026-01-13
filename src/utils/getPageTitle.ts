import { TThemeConfig, TThemePageMetadataKey } from "@/types";

export const getPageTitle = (themeConfig: TThemeConfig, metadataKey?: TThemePageMetadataKey, text?: string) => {
  if (!metadataKey) return "";
  const metadata = themeConfig.pageMetadata[metadataKey];
  return text ? metadata.title.replace("{text}", text) : metadata.title;
};
