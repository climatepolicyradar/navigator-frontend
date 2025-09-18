import { TTheme } from "@/types";

// Can be one string per app or a default with overrides
export type TTextDictionary = Record<TTheme, string> | ({ default: string } & Partial<Record<TTheme, string>>);

// All app-specific text strings, by theme value (TTheme)
// Don't reference this directly, use the useText hook
export const APP_TEXT = {
  recentFamiliesBlockTitle: {
    default: "Recent documents",
    ccc: "Recent cases",
  },
  searchOnboarding: {
    default: "You are currently viewing all of the documents in our database. Narrow your search by document type, geography, date, and more.",
    ccc: "You are currently viewing all of the cases in the Climate Litigation Database. Narrow your search by case categories, geography, and more.",
  },
} satisfies Record<string, TTextDictionary>;

export type TTextKey = keyof typeof APP_TEXT;
