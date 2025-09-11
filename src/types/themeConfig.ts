import { TConfigFeatures } from "./features";

/* Blocks */

// All of the possible block names used in TThemeConfig.pageBlocks to specify which blocks to render on each page
// Adding a new block to a page? Add a new string to the page's type here, then add the new key to the TBlockDefinitions declaration on the page
export type TFamilyPageBlock = "debug" | "documents" | "metadata" | "summary";
export type TGeographyPageBlock = "debug" | "legislative-process" | "recents" | "statistics" | "subdivisions" | "targets";
export type TBlock = TFamilyPageBlock | TGeographyPageBlock;

type TThemePageBlocks = {
  family: TFamilyPageBlock[];
  geography: TGeographyPageBlock[];
};

/* Everything else */

export type TDocumentCategory =
  | "All"
  | "UNFCCC Submissions"
  | "Laws"
  | "Policies"
  | "Litigation"
  | "Climate Finance Projects"
  | "Offshore Wind Reports";

export type TLabelVariation = {
  category: string[];
  label: string;
  key: string;
};

export type TThemeConfigOption<Value> = {
  label: string;
  slug: string;
  value: Value;
  category?: string[];
  corporaKey?: string;
  alias?: string;
  additionalInfo?: string;
  learnMoreUrl?: string;
  learnMoreExternal?: string;
};

type TThemeConfigCategory = {
  label: string;
  options: TThemeConfigOption<string[]>[];
};

interface IThemeConfigFilterType {
  label: string;
  taxonomyKey: string;
  apiMetaDataKey?: string;
  type: string;
  category: string[];
  categoryKey?: string;
  startOpen?: "true" | "false";
  showFade?: "true" | "false";
  dependentFilterKey?: string;
  corporaKey?: string;
  quickSearch?: string;
  showTopicsMessage?: boolean;
}

interface IThemeConfigFilterCheckbox extends IThemeConfigFilterType {
  type: "checkbox";
  options: TThemeConfigOption<"true" | "false" | string[]>[];
}

interface IThemeConfigFilterFilterRadio extends IThemeConfigFilterType {
  type: "radio";
  options?: TThemeConfigOption<string | string[]>[];
}

export type TThemeConfigFilter = IThemeConfigFilterCheckbox | IThemeConfigFilterFilterRadio;

type TThemeLink = {
  key: string;
  url: string;
};

type TThemeMetadata = {
  key: string;
  title: string;
  description: string;
};

export type TThemeConfig = {
  defaultCorpora?: string[];
  categories?: TThemeConfigCategory;
  filters: TThemeConfigFilter[];
  labelVariations: TLabelVariation[];
  links: TThemeLink[];
  metadata: TThemeMetadata[];
  documentCategories: TDocumentCategory[];
  defaultDocumentCategory: TDocumentCategory;
  pageBlocks: TThemePageBlocks;
  features: TConfigFeatures;
};
