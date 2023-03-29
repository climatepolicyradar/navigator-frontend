import { createContext } from "react";

type TThemes = "cpr" | "cclw";

export const ThemeContext = createContext<TThemes>(null);
