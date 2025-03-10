import { promises as fs } from "fs";
import path from "path";

import { TThemeConfig } from "@/types";

export const readConfigFile = async (theme: string): Promise<TThemeConfig> => {
  const dataFilePath = path.join(process.cwd(), `/themes/${theme}/config.json`);
  const fileContents = await fs.readFile(dataFilePath, "utf8");
  return JSON.parse(fileContents);
};
