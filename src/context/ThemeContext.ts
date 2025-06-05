import { createContext } from "react";

import { TTheme, TThemeConfig } from "@/types";

interface IProps {
  theme: TTheme;
  themeConfig: TThemeConfig;
}

export const ThemeContext = createContext<IProps>(null);
