export type TSearchQueryRule =
  | {
      field: "labels.value.id" | "labels.value.type" | "attributes.status";
      op: "contains" | "not_contains" | "eq";
      value: string;
      checked?: true;
    }
  | {
      field: "type" | "value";
      op: "contains" | "not_contains" | "eq";
      value: string;
      checked?: true;
    }
  | {
      field: "attributes.published_date";
      key?: "published_date";
      op: "eq" | "not_eq" | "lt" | "lte" | "gt" | "gte";
      value: string;
    }
  | {
      field: "document_id";
      op: "contains";
      value: string;
    };

export type TSearchQueryGroup = {
  op: "and" | "or";
  filters: (TSearchQueryGroup | TSearchQueryRule)[];
};

export const isRule = (node: TSearchQueryGroup | TSearchQueryRule): node is TSearchQueryRule => "field" in node;
