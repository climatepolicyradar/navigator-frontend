export type TTheme = "cpr" | "cclw" | "mcf" | "ccc";

export type TSearchKeywordFilters = {
  categories?: string[];
  regions?: string[];
  countries?: string[];
  subdivisions?: string[];
};

export type TSearchConceptFilters = {
  names?: string[];
  ids?: string[];
};

export type TSearchCriteriaMeta = {
  name: string;
  value: string;
};

export type TSearchCriteria = {
  concept_filters: { name: string; value: string }[];
  continuation_tokens?: string[] | null;
  corpus_import_ids: string[];
  document_ids?: string[] | null;
  exact_match: boolean;
  family_ids?: string[] | null;
  keyword_filters?: TSearchKeywordFilters;
  limit: number;
  max_passages_per_doc: number;
  metadata: TSearchCriteriaMeta[];
  offset: number;
  page_size: number;
  query_string: string;
  sort_field: string | null;
  sort_order: string;
  sort_within_page: boolean;
  year_range: [string, string];
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

export type TDataNode<T> = {
  node: T;
  children: TDataNode<T>[];
};

export type TGeography = {
  id: number;
  display_value: string;
  value: string;
  type: string;
  parent_id: number | null;
  slug: string;
};

export type TGeographySubdivision = {
  code: string;
  name: string;
  type: string;
  country_alpha_2: string;
  country_alpha_3: string;
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
  MCF: number;
  Reports: number;
};

type TGeoFamilys = {
  Legislative: TFamily[];
  Executive: TFamily[];
  UNFCCC: TFamily[];
  MCF: TFamily[];
  Reports: TFamily[];
};

export type TGeographySummary = {
  family_counts: TGeoFamilyCounts;
  events: TEvent[];
  targets: string[];
  top_families: TGeoFamilys;
};

export type TCategory = "Legislative" | "Executive" | "Litigation" | "Policy" | "Law" | "UNFCCC" | "MCF" | "Reports";
export type TCorpusTypeSubCategory = "AF" | "CIF" | "GCF" | "GEF" | "Laws and Policies" | "Intl. agreements" | "Reports";
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
  document_type?: string;
};

export type TMCFFamilyMetadata = {
  approval_date?: string;
  category?: TCorpusTypeSubCategory | TCategory;
  organisation?: string;
  theme?: string[];
  geographies?: string[];
  sector?: string[];
  implementing_agency?: string[];
  project_value_fund_spend?: string[];
  project_value_co_financing?: string[];
  result_area?: string[];
  status?: string[];
  project_url?: string[];
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

export type TCorpusWithStats = {
  corpus_import_id: string;
  title: string;
  description: string;
  image_url: string;
  text: string;
  organisation_name: string;
  organisation_id: number;
  total: number;
  count_by_category: {
    [key: string]: number;
  };
};

export type TOrganisation = {
  corpora: TCorpus[];
  total: number;
  count_by_category: {
    [key: string]: number;
  };
};

export type TCorpusType = {
  corpus_type_name: string;
  corpus_type_description: string;
  taxonomy: {
    [key: string]: {
      allow_any: boolean;
      allow_blanks: boolean;
      allowed_values: string[];
    };
  };
  corpora: TCorpusWithStats[];
};

export interface IDictionary<T> {
  [Key: string]: T;
}

export type TOrganisationDictionary = IDictionary<TOrganisation>;
export type TCorpusTypeDictionary = IDictionary<TCorpusType>;

export interface IConcept {
  alternative_labels: string[];
  count?: number;
  definition?: string;
  description: string;
  has_subconcept: string[];
  labelled_passages?: [];
  negative_labels: string[];
  preferred_label: string;
  recursive_subconcept_of: string[];
  related_concepts: string[];
  subconcept_of: string[];
  wikibase_id: string;
}

export interface LegalConcept extends IConcept {
  type: "principal_law" | "jurisdiction" | "category";
}

export type TSearchResponse = {
  total_hits: number;
  total_family_hits: number;
  query_time_ms?: number;
  total_time_ms?: number;
  families: {
    id: string;
    hits: (TFamily & {
      concept_counts?: Record<string, number>;
      document_import_id: string;
    })[];
  }[];
  continuation_token?: string;
  this_continuation_token: string;
  prev_continuation_token: string;
};
