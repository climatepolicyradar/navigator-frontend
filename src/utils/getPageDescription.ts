import { TThemeConfig } from "@/types";

export const getPageDescription = (themeConfig?: TThemeConfig, metadataKey?: string, text?: string) => {
  let description = "";
  if (metadataKey && themeConfig) {
    description = themeConfig.metadata.find((meta) => meta.key === metadataKey)?.description ?? "";
    if (text) description = description.replace("{text}", text);
  }

  return description;
};
