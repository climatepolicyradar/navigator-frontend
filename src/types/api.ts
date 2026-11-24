type TApiDataNode<T> = {
  node: T;
  children: TApiDataNode<T>[];
};

export type TApiItemResponse<T = unknown> = {
  data: T;
};

type TApiGeography = {
  id: number;
  display_value: string;
  value: string;
  type: string;
  parent_id: number | null;
  slug: string;
};

type TApiMetadata<Key extends string> = {
  [K in Key]?: string[];
};

export const API_FAMILY_METADATA_KEY = [
  "author_type",
  "author",
  "document_type",
  "framework",
  "hazard",
  "id",
  "instrument",
  "keyword",
  "sector",
  "topic",
  // Litigation specific
  "case_number",
  "concept_preferred_label",
  "core_object",
  "original_case_name",
  "status",
  // MCF specific
  "focal_area",
  "implementing_agency",
  "project_id",
  "project_url",
  "project_value_co_financing",
  "project_value_fund_spend",
  "result_area",
  "theme",
] as const;
export type TApiFamilyMetadataKey = (typeof API_FAMILY_METADATA_KEY)[number];
export type TApiFamilyMetadata = TApiMetadata<TApiFamilyMetadataKey>;

export type TApiLoadingStatus = "idle" | "loading" | "success" | "error";

type TApiLanguages = {
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

type TApiCorpusTypeDictionary = IApiDictionary<TApiCorpusType>;

export type TApiConfig = {
  geographies: TApiDataNode<TApiGeography>[];
  corpus_types: TApiCorpusTypeDictionary;
  languages: TApiLanguages;
};

export type TApiFamilyConcept = {
  id: string;
  ids: string[];
  type: string;
  relation: string;
  preferred_label: string;
  subconcept_of_labels: string[];
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
