import { TCategory, TTheme } from "@/types";

// NOTE: Don't reference the constants in this file directly, use the useText hook

export type TDictionary<Variant extends string> = Record<Variant, string> | ({ default: string } & Partial<Record<Variant, string>>);

/* App-specific text */

export type TAppDictionary = TDictionary<TTheme>;

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

export type TCategoryDictionary = TDictionary<TCategory>;

export const CATEGORY_DICTIONARY = {
  // TODO resolve different litigation cases depending on API endpoint used
  // TODO store singular and plural in the same key?
  familySingular: {
    default: "document",
    Executive: "policy",
    EXECUTIVE: "policy",
    Law: "law",
    Legislative: "law",
    LEGISLATIVE: "law",
    Litigation: "case",
    LITIGATION: "cases",
    Policy: "policy",
    MCF: "project",
  },
  familyPlural: {
    default: "document",
    Executive: "policies",
    EXECUTIVE: "policies",
    Law: "laws",
    Legislative: "laws",
    LEGISLATIVE: "laws",
    Litigation: "cases",
    LITIGATION: "cases",
    Policy: "policies",
    MCF: "projects",
  },
  familyDate: {
    default: "Date",
    MCF: "Approval FY",
  },
} satisfies Record<string, TCategoryDictionary>;

export type TCategoryDictionaryKey = keyof typeof CATEGORY_DICTIONARY;
