import { TThemeConfig } from "@/types";
import { promises as fs } from "fs";
import path from "path";
import { TFeatureFlags } from "./featureFlags";

// Modifies config by reference
const addCorporaToCategories = (config: TThemeConfig, categorySlugs: string[], corpusIds: string[]): void => {
  config.categories.options.forEach((category) => {
    if (categorySlugs.includes(category.slug)) {
      category.value = [...(category.value || []), ...corpusIds];
    }
  });
};

export const readConfigFile = async (theme: string, featureFlags: TFeatureFlags): Promise<TThemeConfig> => {
  const dataFilePath = path.join(process.cwd(), `/themes/${theme}/config.json`);
  const fileContents = await fs.readFile(dataFilePath, "utf8");
  const config = JSON.parse(fileContents);

  if (featureFlags.litigation) {
    addCorporaToCategories(config, ["All"], ["Academic.corpus.Litigation.n0000"]);
  }

  return config;
};
