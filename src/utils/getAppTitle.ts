import { TThemeConfig } from "@/types";

export const getAppTitle = (themeConfig?: TThemeConfig) => {
  let title = "";
  if (themeConfig) {
    title = themeConfig.metadata.find((meta) => meta.key === "default")?.title ?? "";
  }
  return title;
};
