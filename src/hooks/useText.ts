import { useContext } from "react";

import { APP_TEXT, TTextKey } from "@/constants/text";
import { ThemeContext } from "@/context/ThemeContext";

export const useText = () => {
  const { theme } = useContext(ThemeContext);

  return {
    getText: (textKey: TTextKey): string => {
      const textDictionary = APP_TEXT[textKey];

      let text: string | undefined = undefined;

      if ("default" in textDictionary) {
        text = theme in textDictionary ? textDictionary[theme] : textDictionary.default;
      } else {
        text = textDictionary[theme];
      }

      // Just in case, if APP_TEXT is incorrectly shaped, show the key in a way that will stand out as incorrect
      return text ?? textKey.toUpperCase();
    },
  };
};
