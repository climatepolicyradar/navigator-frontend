import { TThemeConfig } from "@/types";

export const readConfigFile = async (theme: string): Promise<TThemeConfig> => {
  const configModule = await import(`../../themes/${theme}/config.ts`);
  return configModule.default;
};
