import { useContext } from "react";

import { APP_DICTIONARY, CATEGORY_DICTIONARY, TAppDictionaryKey, TDictionary, TCategoryDictionaryKey } from "@/constants/text";
import { ThemeContext } from "@/context/ThemeContext";
import { TCategory } from "@/types";

const getValueFromDictionary = (dictionary: Record<string, TDictionary<string>>, textKey: string, variant: string): string => {
  const dictionaryEntry = dictionary[textKey];

  let text: string | undefined = undefined;

  if (dictionaryEntry) {
    if ("default" in dictionaryEntry) {
      text = variant in dictionaryEntry ? dictionaryEntry[variant] : dictionaryEntry.default;
    } else {
      text = dictionaryEntry[variant];
    }
  }

  // Just in case, if APP_TEXT is incorrectly shaped, show the key in a way that will stand out as incorrect
  return text ?? textKey.toUpperCase();
};

export const useText = () => {
  const { theme } = useContext(ThemeContext);

  return {
    getAppText: (textKey: TAppDictionaryKey) => getValueFromDictionary(APP_DICTIONARY, textKey, theme),
    getCategoryTextLookup: (category: TCategory) => (textKey: TCategoryDictionaryKey) =>
      getValueFromDictionary(CATEGORY_DICTIONARY, textKey, category),
  };
};
