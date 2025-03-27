import { TThemeConfig } from "@/types";

export const getPageTitle = (themeConfig?: TThemeConfig, metadataKey?: string, text?: string) => {
  let title = "";
  if (metadataKey && themeConfig) {
    title = themeConfig.metadata.find((meta) => meta.key === metadataKey)?.title ?? "";
    if (text) title = title.replace("{text}", text);
  }
  return title;
};
