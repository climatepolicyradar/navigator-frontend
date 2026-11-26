import { TSingularAndPlural } from "./display";
import { TLabel } from "./label";

export const THEMES = ["cpr", "cclw", "mcf", "ccc"] as const;

export type TTheme = (typeof THEMES)[number];

type TPassageBlockCoords = [number, number];

export type TPassage = {
  block_id_sort_key?: number;
  concepts?: any[];
  text_block_coords: TPassageBlockCoords[];
  text_block_id: string;
  text_block_page: number;
  text: string;
};

export type TDataNode<T> = {
  node: T;
  children: TDataNode<T>[];
};

export type GeographyTypeV2 = "region" | "country" | "subdivision";

export type GeographyV2 = {
  id: string;
  type: GeographyTypeV2;
  slug: string;
  subconcept_of?: GeographyV2[];
  has_subconcept?: GeographyV2[];
  name: string;
  alpha_2?: string;
  statistics?: {
    name: string;
    legislative_process: string;
    federal: boolean;
    federal_details: string;
    political_groups: string;
    global_emissions_percent: string;
    climate_risk_index: string;
    worldbank_income_group: string;
    visibility_status: string;
  };
};

export type TGeography = {
  id: number;
  display_value: string;
  value: string;
  type: string;
  parent_id: number | null;
  slug: string;
};

export type TCountryOption = {
  // The country's ISO 3166-1 alpha-3 code when from the taxonomy (e.g. "AUS"), or its /config id
  id: string;
  slug: string;
  display_value: string;
};

export type TCorpusTypeSubCategory = "AF" | "CIF" | "GCF" | "GEF" | "Laws and Policies" | "Intl. agreements" | "Litigation" | "Reports";

export type TAttributionCategory =
  | "Global Stocktake"
  | "Law"
  | "Litigation"
  | "Multilateral Climate Fund project"
  | "Policy"
  | "Report"
  | "UN submission";

type TEvent = {
  title: string;
  date: string;
  event_type: string;
  status: string;
};

export type TDocumentContentType = "application/pdf" | "text/html" | "application/octet-stream";

type TMetadata<Key extends string> = {
  [K in Key]?: string[];
};

export type TFamilyMetadata = TMetadata<
  | "author_type"
  | "author"
  | "document_type"
  | "framework"
  | "hazard"
  | "id"
  | "instrument"
  | "keyword"
  | "sector"
  | "topic"
  // Litigation specific
  | "case_number"
  | "concept_preferred_label"
  | "core_object"
  | "original_case_name"
  | "status"
  // MCF specific
  | "focal_area"
  | "implementing_agency"
  | "project_value_fund_spend"
  | "project_value_co_financing"
  | "project_url"
  | "theme"
  | "result_area"
>;

export type TMCFFamilyMetadata = {
  approval_date?: string;
  category?: TAttributionCategory;
  fund?: string;
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

export type TLatestItem = {
  title: string;
  date: string;
  slug: string;
  url: string;
};

export type TLoadingStatus = "idle" | "loading" | "success" | "error";

type TCorpusWithStats = {
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

type TCorpusType = {
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

interface IDictionary<T> {
  [Key: string]: T;
}

export type TCorpusTypeDictionary = IDictionary<TCorpusType>;

export type TFamilyConcept = {
  id: string;
  ids: string[];
  type: string;
  relation: string;
  preferred_label: string;
  subconcept_of_labels: string[];
};

/* /families API response types */

export type TCollectionPublic = {
  description: string;
  import_id: string;
  metadata: TMetadata<"event_type" | "description" | "datetime_event_name" | "id">;
  slug: string;
  title: string;
};

export type TCollectionPublicWithFamilies = TCollectionPublic & {
  families: TFamilyPublic[];
};

type TCorpusPublic = {
  corpus_type_name: string;
  import_id: string;
  organisation: {
    id: number;
    name: string;
  };
  title: string;
  attribution_url: string | null;
};

export type TFamilyEventPublic = TEvent & {
  import_id: string;
  metadata: TMetadata<
    | "action_taken"
    | "case_number"
    | "concept_preferred_label"
    | "core_object"
    | "datetime_event_name"
    | "description"
    | "event_type"
    | "id"
    | "original_case_name"
    | "status"
  >;
};

export type TFamilyDocumentPublic = {
  cdn_object: string;
  content_type: TDocumentContentType | null;
  document_role: string | null;
  document_type: string | null;
  events: TFamilyEventPublic[];
  import_id: string;
  language: string | null;
  languages: string[];
  md5_sum: string | null;
  slug: string | null;
  source_url: string | null;
  title: string;
  valid_metadata: TMetadata<"id">;
  variant_name: string | null;
  variant: string | null;
  document_status: string | null;
};

export type TFamilyAttribution = {
  category: TAttributionCategory;
  corpusImage?: string;
  corpusImageAlt: string;
  corpusNote: string;
  provider: string;
  taxonomy: string;
  url?: string;
};

export type TFamilyPublic = {
  attribution: TFamilyAttribution;
  collections: TCollectionPublic[];
  concepts: TFamilyConcept[];
  corpus?: TCorpusPublic;
  documents: TFamilyDocumentPublic[];
  events: TFamilyEventPublic[];
  geographies: TLabel[];
  import_id: string;
  last_updated_date: string | null;
  metadata: TFamilyMetadata;
  published_date: string | null;
  slug: string;
  summary: string;
  title: string;
};

export type TCategorySummary = {
  id: string;
  count: number;
  families: TFamilySummary[];
  title: string;
  singularAndPlural: TSingularAndPlural;
};

export type TFamilySummary = {
  href: string;
  metadata: string[];
  title: string;
};
