import { ReactNode } from "react";

// Ensures that removing FAQ items that are in use causes build errors, especially when removing an FAQ also used in a tooltip
export type TFAQKey =
  | "canAPI"
  | "canDownloadTopicsResults"
  | "howAccurateResults"
  | "howBugReport"
  | "howDownload"
  | "howFilter"
  | "howLink"
  | "howMistakeReport"
  | "howTextSearch"
  | "howUseTopics"
  | "howWeBuildTopic"
  | "howWeDate"
  | "howWeTranslate"
  | "searchDocsForTopics"
  | "shouldConcernedImpact"
  | "whatImprovementsNext"
  | "whatLimitations"
  | "whatMultipleTopics"
  | "whichDateMostRecent"
  | "whichTopicsAvailable"
  | "whyExternalRedirect"
  | "whyNoMatches"
  | "whyTopicsNoHighlight";

export type TFAQ = {
  id?: string;
  title: string;
  content: ReactNode;
  headContent?: ReactNode;
};

export type TProductSupportKey = "mostRecent" | "searchInsideDoc" | "textHighlighting" | "topics";

export type TProductSupport = {
  title: string;
  items: (TFAQKey | TFAQ)[];
};

export const isFAQKey = (item: TFAQKey | TFAQ): item is TFAQKey => typeof item === "string";
