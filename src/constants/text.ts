import { TTheme } from "@/types";

// Can be one string per app or a default with overrides
export type TTextDictionary = Record<TTheme, string> | ({ default: string } & Partial<Record<TTheme, string>>);

// All app-specific text strings, by theme value (TTheme)
// Don't reference this directly, use the useText hook
export const APP_TEXT = {
  foo: {
    default: "bar",
  },
  baz: {
    cpr: "cpr",
    mcf: "mcf",
    cclw: "cclw",
    ccc: "ccc",
  },
} satisfies Record<string, TTextDictionary>;

export type TTextKey = keyof typeof APP_TEXT;
