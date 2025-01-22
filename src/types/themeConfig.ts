export type TDocumentCategory = "All" | "Laws" | "Policies" | "UNFCCC" | "Litigation" | "MCF";

export type TLabelVariation = {
  category: string[];
  label: string;
  key: string;
};

export type TThemeConfigOption = {
  label: string;
  slug: string;
  value?: string[];
  category?: string[];
  corporaKey?: string;
  alias?: string;
  additionalInfo?: string;
  learnMoreUrl?: string;
  learnMoreExternal?: string;
};

type TThemeConfigCategory = {
  label: string;
  options: TThemeConfigOption[];
};

export type TThemeConfigFilter = {
  label: string;
  taxonomyKey: string;
  apiMetaDataKey?: string;
  type: string;
  category: string[];
  categoryKey?: string;
  startOpen?: "true" | "false";
  options?: TThemeConfigOption[];
  showFade?: "true" | "false";
  dependentFilterKey?: string;
  corporaKey?: string;
  quickSearch?: string;
};

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
};
