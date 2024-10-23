export type TTheme = "cpr" | "cclw" | "mcf";

export type TSearchKeywordFilters = {
  categories?: string[];
  regions?: string[];
  countries?: string[];
};

export type TSearchCriteriaMeta = {
  name: string;
  value: string;
};

export type TSearchCriteria = {
  query_string: string;
  exact_match: boolean;
  max_passages_per_doc: number;
  keyword_filters?: TSearchKeywordFilters;
  year_range: [number, number];
  sort_field: string | null;
  sort_order: string;
  page_size: number;
  limit: number;
  offset: number;
  family_ids?: string[] | null;
  document_ids?: string[] | null;
  continuation_tokens?: string[] | null;
  corpus_import_ids: string[];
  metadata: TSearchCriteriaMeta[];
  // for internal use
  runSearch?: boolean;
};

export type TPassageBlockCoords = [number, number];

export type TPassage = {
  text: string;
  text_block_coords: TPassageBlockCoords[];
  text_block_id: string;
  text_block_page: number;
};

export type TGeography = {
  id: number;
  display_value: string;
  value: string;
  type: string;
  parent_id: number | null;
  slug: string;
};

export type TTarget = {
  ID: string;
  "Target type": string;
  Source: string;
  Description: string;
  "GHG target": "TRUE" | "FALSE";
  Year: string;
  "Base year period": string;
  "Single year": "TRUE" | "FALSE";
  Geography: string;
  "Geography ISO": string;
  Sector: string;
  "CCLW legislation ID": string;
  Scopes: string;
  "Visibility status": string;
  "CPR family ID": string;
  "Net zero target?": "TRUE" | "FALSE";
  "family-slug": string;
  "family-name": string;
};

export type TGeographyConfigNode = {
  id: number;
  display_value: string;
  value: string;
  type: string;
  parent_id: number;
  slug: string;
};

export type TGeographyConfig = {
  node: TGeographyConfigNode;
  children: TGeographyConfig[];
};

export type TGeographyStats = {
  name: string;
  geography_slug: string;
  legislative_process: string;
  federal: boolean;
  federal_details: string;
  political_groups: string;
  global_emissions_percent: number;
  climate_risk_index: number;
  worldbank_income_group: string;
  visibility_status: string;
};

type TGeoFamilyCounts = {
  Legislative: number;
  Executive: number;
  UNFCCC: number;
};

type TGeoFamilys = {
  Legislative: TFamily[];
  Executive: TFamily[];
  UNFCCC: TFamily[];
};

export type TGeographySummary = {
  family_counts: TGeoFamilyCounts;
  events: TEvent[];
  targets: string[];
  top_families: TGeoFamilys;
};

export type TCategory = "Legislative" | "Executive" | "Litigation" | "Policy" | "Law" | "UNFCCC" | "MCF";
export type TCorpusTypeSubCategory = "AF" | "CIF" | "GCF" | "GEF" | "Laws and Policies" | "Intl. agreements";
export type TDisplayCategory = "All" | TCategory;
export type TEventCategory = TCategory | "Target";

export type TEvent = {
  title: string;
  date: string;
  event_type: string;
  status: string;
};

export type TAssociatedDocument = {
  country_code: string;
  country_name: string;
  description: string;
  name: string;
  postfix: string;
  slug: string;
  publication_ts: string;
  category?: TCategory;
};

export type TFamilyDocument = {
  document_content_type: "application/pdf";
  document_date: string;
  document_passage_matches: TPassage[];
  document_slug: string;
  document_source_url: string;
  document_title: string;
  document_type: string;
  document_url: string;
};

export type TFamily = {
  corpus_type_name: TCorpusTypeSubCategory;
  family_category: TCategory;
  family_description: string;
  family_documents: TFamilyDocument[];
  family_geographies: string[];
  family_metadata: {}; // TODO: type this
  family_name: string;
  family_slug: string;
  family_source: string;
  family_date: string;
};

export type TFamilyPage = {
  organisation: string;
  title: string;
  summary: string;
  geography: string;
  geographies: string[];
  import_id: string;
  category: TCategory;
  corpus_type_name: TCorpusTypeSubCategory;
  metadata: TFamilyMetadata;
  slug: string;
  corpus_id: string;
  events: TEvent[];
  documents: TDocumentPage[];
  collections: TCollection[];
  published_date: string | null;
  last_updated_date: string | null;
};

export type TDocumentContentType = "application/pdf" | "text/html" | "application/octet-stream";

export type TDocumentPage = {
  import_id: string;
  variant?: string | null;
  slug: string;
  title: string;
  md5_sum?: string | null;
  cdn_object?: string | null;
  source_url: string;
  content_type: TDocumentContentType;
  language: string;
  languages: string[];
  document_type: string | null;
  document_role: string;
};

export type TCollection = {
  import_id: string;
  title: string;
  description: string;
  families: TCollectionFamily[];
};

export type TCollectionFamily = {
  description: string;
  slug: string;
  title: string;
};

export type TFamilyMetadata = {
  topic?: string[];
  hazard?: string[];
  sector?: string[];
  keyword?: string[];
  framework?: string[];
  instrument?: string[];
  author_type?: string[];
  author?: string[];
};

export type TMatchedFamily = TFamily & {
  family_description_match: boolean;
  family_title_match: boolean;
  total_passage_hits: number;
  continuation_token?: string; // represents a token for requesting more passage matches
};

export type TSearch = {
  hits: number;
  query_time_ms: number;
  families: TMatchedFamily[];
};

export type TLoadingStatus = "idle" | "loading" | "success" | "error";

export type TLanguages = {
  [key: string]: string;
};

export type TCorpus = {
  title: string;
  description: string;
  corpus_type: string;
  corpus_type_description: string;
  corpus_import_id: string;
  image_url: string;
  text: string;
  // taxonomies
  taxonomy: {
    [key: string]: {
      allow_any: boolean;
      allow_blanks: boolean;
      allowed_values: string[];
    };
  };
};

export type TOrganisation = {
  corpora: TCorpus[];
  total: number;
  count_by_category: {
    [key: string]: number;
  };
};

export interface TDictionary<T> {
  [Key: string]: T;
}

export type TOrganisationDictionary = TDictionary<TOrganisation>;

export type TQueryStrings = {
  // Core
  query_string: string;
  exact_match: string;
  region: string;
  country: string;
  category: string;
  year_range: string;
  sort_field: string;
  sort_order: string;
  offset: string;
  active_continuation_token: string;
  continuation_tokens: string;
  // Multilater Climate Funds (MCF)
  fund: string;
  status: string;
  implementing_agency: string;
};

// Theme configuration types
interface ILabelVariation {
  [key: string]: string;
}

export type TThemeConfigOption = {
  label: string;
  slug: string;
  value?: string[];
  category?: string[];
};

type TThemeConfigCategory = {
  label: string;
  options: TThemeConfigOption[];
};

export type TThemeConfigFilter = {
  label: string;
  corporaTypeKey?: string;
  taxonomyKey: string;
  apiMetaDataKey?: string;
  type: string;
  category: string[];
  options?: TThemeConfigOption[];
};

export type TThemeConfig = {
  corpusIds: string[];
  categories: TThemeConfigCategory;
  filters: TThemeConfigFilter[];
  labelVariations: ILabelVariation & { categories: string[] }[];
};
