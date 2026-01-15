export type TTopic = {
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

export type TTopics = {
  rootTopics: TTopic[];
  topics: TTopic[];
};
