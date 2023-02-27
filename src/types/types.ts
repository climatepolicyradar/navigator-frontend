// TODO: split this file into relevant sub type files based on usage

export type TSearchKeywordFilters = {
  categories?: string[];
  regions?: string[];
  countries?: string[];
};

export type TSearchCriteria = {
  query_string: string;
  exact_match: boolean;
  max_passages_per_doc: number;
  keyword_filters?: TSearchKeywordFilters;
  year_range: [number, number];
  sort_field: string | null;
  sort_order: string;
  limit: number;
  offset: number;
  group_documents?: boolean;
};

type TErrorDetail = {
  loc: string[];
  msg: string;
  type: string;
};

export type TError = {
  detail: TErrorDetail[];
};

export type TDocumentType = {
  id: number;
  name: string;
  description: string;
};

export type TMeta = {
  description: string;
  id: number;
  name: string;
  parent_id?: number;
  source_id: number;
};

export type TSector = {
  description: string;
  id: number;
  name: string;
  parent_id?: number;
  source_id: number;
};

export type TRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export type TPassageBlockCoords = [number, number];

export type TPassage = {
  text: string;
  text_block_coords: TPassageBlockCoords[];
  text_block_id: string;
  text_block_page: number;
};

export type TDocument = {
  document_category: TEventCategory;
  document_content_type: string;
  document_geography: string;
  document_country_english_shortname: string;
  document_date: string;
  document_description: string;
  document_description_match: boolean;
  document_slug: string;
  document_name: string;
  document_postfix: string;
  document_passage_matches: TPassage[];
  document_source_name: string;
  document_source_url: string;
  document_title_match: boolean;
  document_type: string;
  document_url: string;
  document_id: string;
  document_fileid?: string;
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
  target: string;
  group: string;
  base_year: string;
  target_year: string;
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

export type TGeographySummary = {
  document_counts: { Law: number; Policy: number; Case: number };
  events: TEvent[];
  targets: string[];
  top_documents: { Law: TDocument[]; Policy: TDocument[]; Case: TDocument[] };
};

export type TCategory = "Law" | "Policy" | "Case";
export type TDisplayCategory = "All" | "Legislative" | "Executive" | "Litigation";

export type TEventCategory = TCategory | "Target";

export type TEvent = {
  name: string;
  created_ts: string;
  description: string;
  category?: TEventCategory;
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

// export type TFamilyDocument = {
//   id: number;
//   type: { name: string; description: string };
//   title: string;
//   date: string;
//   variant: { id: number; label: string; description: string };
//   format: string;
//   matches: number;
//   slug: string;
// };

export type TFamilyDocument = {
  document_category: TCategory;
  document_content_type: "application/pdf";
  document_date: string;
  document_passage_matches: TPassage[];
  document_slug: string;
  document_source_url: string;
  document_title: string;
  document_type: TCategory;
  document_url: string;
};

export type TFamily = {
  family_description: string;
  family_description_match: boolean;
  family_documents: TFamilyDocument[];
  family_geography: string;
  family_metadata: {};
  family_name: string;
  family_slug: string;
  family_source: string;
  family_title_match: boolean;
};

export type TSearch = {
  hits: number;
  query_time_ms: number;
  families: TFamily[];
};
