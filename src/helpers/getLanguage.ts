import { TLanguages } from "@types";

export const getLanguage = (languageKey: string, dataSet: TLanguages) => {
  return dataSet[languageKey];
};
