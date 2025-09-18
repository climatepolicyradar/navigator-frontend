import { createContext } from "react";

import { TTheme, TThemeConfig } from "@/types";

export interface IProps {
  theme: TTheme;
  themeConfig: TThemeConfig;
  loaded: boolean;
}

export const ThemeContext = createContext<IProps>(null);
