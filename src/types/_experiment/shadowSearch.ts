// Operator for a single condition: equals or not-equals.
export type TFilterOperator = "eq" | "ne";

// One condition in the query: field, operator, value, and how it connects to the previous.
export type TFilterClause = {
  id: string;
  // AND/OR before this clause; null for the first clause.
  connector: "and" | "or" | null;
  field: string;
  operator: TFilterOperator;
  value: string;
};

export type TActiveFilters = {
  concepts: string[];
  geos: string[];
  years: string[];
  documentTypes: string[];
};
