export type TSearchQueryRule =
  | {
      field: "labels.value.id" | "attributes.status";
      op: "contains" | "not_contains" | "eq";
      value: string;
    }
  | {
      field: "attributes.published_date";
      key?: "published_date";
      op: "eq" | "not_eq" | "lt" | "lte" | "gt" | "gte";
      value: string;
    };

export type TSearchQueryGroup = {
  op: "and" | "or";
  filters: (TSearchQueryGroup | TSearchQueryRule)[];
};

export const isRule = (node: TSearchQueryGroup | TSearchQueryRule): node is TSearchQueryRule => "field" in node;
