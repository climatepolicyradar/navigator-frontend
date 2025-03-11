import { TThemeConfig } from "@/types";

export const getThemeConfigLink = (themeConfig: TThemeConfig | null, key: string) => {
  return themeConfig?.links?.find((link) => link.key === key);
};
