import { TAttributionCategory, TTheme } from "@/types";

// NOTE: Don't reference the constants in this file directly, use the useText hook

export type TDictionary<Variant extends string> = Record<Variant, string> | ({ default: string } & Partial<Record<Variant, string>>);

/* App-specific text */

type TAppDictionary = TDictionary<TTheme>;

export const APP_DICTIONARY = {
  breadcrumbRoot: {
    default: "Home",
    ccc: "Climate Litigation Database",
  },
  familySingular: {
    default: "document",
    ccc: "case",
  },
  familyPlural: {
    default: "documents",
    ccc: "cases",
  },
  searchOnboarding: {
    default: "You are currently viewing all of the documents in our database. Narrow your search by document type, geography, date, and more.",
    ccc: "You are currently viewing all of the cases in the Climate Litigation Database. Narrow your search by case categories, geography, and more.",
  },
  searchResultItemSingular: {
    default: "",
    ccc: "case",
  },
  searchResultItemPlural: {
    default: "",
    ccc: "cases",
  },
} satisfies Record<string, TAppDictionary>;

export type TAppDictionaryKey = keyof typeof APP_DICTIONARY;

/* Corpus type specific text */

type TCategoryDictionary = TDictionary<TAttributionCategory>;

export const CATEGORY_DICTIONARY = {
  // TODO resolve different litigation cases depending on API endpoint used
  // TODO store singular and plural in the same key?
  familySingular: {
    default: "document",
    Law: "law",
    Litigation: "case",
    "Multilateral Climate Fund project": "project",
    Policy: "policy",
  },
  familyPlural: {
    default: "documents",
    Law: "laws",
    Litigation: "cases",
    "Multilateral Climate Fund project": "projects",
    Policy: "policies",
  },
  familyDate: {
    default: "Year",
    "Multilateral Climate Fund project": "Approval FY",
  },
  familyType: {
    default: "Document Type",
    "Multilateral Climate Fund project": "Fund",
  },
} satisfies Record<string, TCategoryDictionary>;

export type TCategoryDictionaryKey = keyof typeof CATEGORY_DICTIONARY;
