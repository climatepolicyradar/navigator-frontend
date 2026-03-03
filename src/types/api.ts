type TApiPassageBlockCoords = [number, number];

export type TApiPassage = {
  block_id_sort_key?: number;
  concepts?: unknown[];
  text_block_coords: TApiPassageBlockCoords[];
  text_block_id: string;
  text_block_page: number;
  text: string;
};

export type TApiDataNode<T> = {
  node: T;
  children: TApiDataNode<T>[];
};

export type TApiItemResponse<T> = {
  data: T;
};

export type TApiGeographyTypeV2 = "region" | "country" | "subdivision";

export type TApiGeographyV2 = {
  id: string;
  type: TApiGeographyTypeV2;
  slug: string;
  subconcept_of?: TApiGeographyV2[];
  has_subconcept?: TApiGeographyV2[];
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

export type TApiGeography = {
  id: number;
  display_value: string;
  value: string;
  type: string;
  parent_id: number | null;
  slug: string;
};

export type TApiGeographySubdivision = {
  code: string;
  name: string;
  type: string;
  country_alpha_2: string;
  country_alpha_3: string;
};

export type TApiGeographyWithDocumentCounts = {
  code: string;
  name: string;
  type: string;
  count: number;
};

export type TApiTarget = {
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
  Comment: string;
  "family-slug": string;
  "family-name": string;
};

// TODO resolve different litigation cases depending on API endpoint used
export type TApiCategory =
  | "Legislative"
  | "LEGISLATIVE"
  | "Executive"
  | "EXECUTIVE"
  | "Litigation"
  | "LITIGATION"
  | "Policy"
  | "Law"
  | "UNFCCC"
  | "MCF"
  | "Reports"
  | "REPORTS";
export type TApiCorpusTypeSubCategory = "AF" | "CIF" | "GCF" | "GEF" | "Laws and Policies" | "Intl. agreements" | "Litigation" | "Reports";

export type TApiEvent = {
  title: string;
  date: string;
  event_type: string;
  status: string;
};

export type TApiFamilyDocument = {
  document_content_type: "application/pdf";
  document_date: string;
  document_passage_matches: TApiPassage[];
  document_slug: string;
  document_source_url: string;
  document_title: string;
  document_type: string;
  document_url: string;
};

/** This is the metadata that is returned via Vespa */
export type TApiVespaMetadata = {
  name: string;
  value: string;
}[];

export type TApiFamily = {
  continuation_token?: string;
  corpus_import_id: string;
  corpus_type_name: TApiCorpusTypeSubCategory;
  family_category: TApiCategory;
  family_date: string;
  family_description_match: boolean;
  family_description: string;
  family_documents: TApiFamilyDocument[];
  family_geographies: string[];
  family_name: string;
  family_slug: string;
  family_source: string;
  family_title_match: boolean;
  prev_continuation_token?: string;
  total_passage_hits: number;
  metadata: TApiVespaMetadata;
};

type TApiDocumentContentType = "application/pdf" | "text/html" | "application/octet-stream";

export type TApiDocumentPage = {
  cdn_object?: string | null;
  content_type: TApiDocumentContentType;
  document_role: string;
  document_type: string | null;
  import_id: string;
  language: string;
  languages: string[];
  md5_sum: string | null;
  slug: string;
  source_url: string;
  title: string;
  variant: string | null;
};

type TApiMetadata<Key extends string> = {
  [K in Key]?: string[];
};

export type TApiFamilyMetadata = TApiMetadata<
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

export type TApiMatchedFamily = TApiFamily & {
  family_description_match: boolean;
  family_title_match: boolean;
  total_passage_hits: number;
  continuation_token?: string; // represents a token for requesting more passage matches
};

export type TApiSearch = {
  hits: number;
  query_time_ms: number;
  families: TApiMatchedFamily[];
  total_family_hits: number;
};

export type TApiLoadingStatus = "idle" | "loading" | "success" | "error";

export type TApiLanguages = {
  [key: string]: string;
};

type TApiCorpusWithStats = {
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

type TApiCorpusType = {
  corpus_type_name: string;
  corpus_type_description: string;
  taxonomy: {
    [key: string]: {
      allow_any: boolean;
      allow_blanks: boolean;
      allowed_values: string[];
    };
  };
  corpora: TApiCorpusWithStats[];
};

interface IApiDictionary<T> {
  [Key: string]: T;
}

export type TApiCorpusTypeDictionary = IApiDictionary<TApiCorpusType>;

export type TApiFamilyConcept = {
  id: string;
  ids: string[];
  type: string;
  relation: string;
  preferred_label: string;
  subconcept_of_labels: string[];
};

export type TApiSearchResponse = {
  total_hits: number;
  total_family_hits: number;
  query_time_ms?: number;
  total_time_ms?: number;
  families: {
    id: string;
    hits: (TApiFamily & {
      // Document metadata returned by Vespa
      concept_counts?: Record<string, number>;
      document_import_id: string;
      document_title: string;
      document_slug: string;
    })[];
  }[];
  continuation_token?: string;
  this_continuation_token: string;
  prev_continuation_token: string;
};

/* /families API response types */

type TApiCollectionPublic = {
  description: string;
  import_id: string;
  metadata: TApiMetadata<"event_type" | "description" | "datetime_event_name" | "id">;
  slug: string;
  title: string;
};

export type TApiCorpusPublic = {
  corpus_type_name: string;
  import_id: string;
  organisation: {
    id: number;
    name: string;
  };
  title: string;
  attribution_url: string | null;
};

export type TApiFamilyEventPublic = TApiEvent & {
  import_id: string;
  metadata: TApiMetadata<
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

export type TApiFamilyDocumentPublic = {
  cdn_object: string;
  content_type: TApiDocumentContentType | null;
  document_role: string | null;
  document_type: string | null;
  events: TApiFamilyEventPublic[];
  import_id: string;
  language: string | null;
  languages: string[];
  md5_sum: string | null;
  slug: string;
  source_url: string | null;
  title: string;
  valid_metadata: TApiMetadata<"id">;
  variant_name: string | null;
  variant: string | null;
  document_status: string | null;
};

export type TApiFamilyPublic = {
  category: TApiCategory;
  corpus_id: string;
  corpus_type_name?: TApiCorpusTypeSubCategory;
  geographies: string[];
  import_id: string;
  last_updated_date: string | null;
  metadata: TApiFamilyMetadata;
  organisation: string;
  published_date: string | null;
  slug: string;
  summary: string;
  title: string;
  corpus?: TApiCorpusPublic;
  collections: TApiCollectionPublic[];
  concepts: TApiFamilyConcept[];
  documents: TApiFamilyDocumentPublic[];
  events: TApiFamilyEventPublic[];
};

export type TApiCollectionPublicWithFamilies = {
  description: string;
  families: TApiFamilyPublic[];
  import_id: string;
  metadata: TApiMetadata<"id">;
  slug: string;
  title: string;
};

export type TApiSlugResponse = {
  name: string;
  family_import_id: string | null;
  family_document_import_id: string | null;
  collection_import_id: string | null;
  created: string;
};

export interface IApiFamilyDocumentTopics {
  documents: {
    importId: string;
    title: string;
    slug: string;
    conceptCounts: Record<string, number>;
  }[];
  conceptCounts: Record<string, number>;
  rootConcepts: TApiTopic[];
  conceptsGrouped: {
    [rootConceptId: string]: TApiTopic[];
  };
}

export type TApiTopic = {
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
  type?: "principal_law" | "jurisdiction" | "category";
};
