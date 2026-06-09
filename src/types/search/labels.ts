export type TSearchLabel = {
  id: string;
  type: string;
  value: string;
  labels: TSearchLabelRelation[];
  alternative_labels?: string[];
};

export type TSearchLabelRelation = {
  type: "subconcept_of";
  value: TSearchLabel;
  timestamp: null;
  passages_id: null;
  count: null;
};

export type TNestedSearchLabel = Omit<TSearchLabel, "labels"> & {
  children: TNestedSearchLabel[];
};
