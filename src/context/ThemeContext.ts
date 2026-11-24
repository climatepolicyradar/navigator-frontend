import { createContext } from "react";

import { DEFAULT_THEME_CONFIG } from "@/constants/themeConfig";
import { TTheme, TThemeConfig } from "@/types";

export interface IProps {
  theme: TTheme;
  themeConfig: TThemeConfig;
}

export const ThemeContext = createContext<IProps>({
  theme: "" as TTheme,
  themeConfig: DEFAULT_THEME_CONFIG,
});
