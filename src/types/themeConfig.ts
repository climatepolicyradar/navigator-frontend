import { TConfigFeatures } from "./features";

export type TDocumentCategory = "All" | "UNFCCC Submissions" | "Laws" | "Policies" | "Litigation" | "Climate Finance Projects" | "Industry Reports";

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
  features: TConfigFeatures;
};
