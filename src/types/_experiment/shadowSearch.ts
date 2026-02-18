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

// A group of clauses combined with AND/OR; groups are combined with AND/OR at the top level.
export type TFilterGroup = {
  id: string;
  connector: "and" | "or" | null;
  clauses: TFilterClause[];
};

// Options for each filter dimension (used by advanced builder and suggested filters).
export type TFilterFieldOptions = {
  topic: string[];
  geography: string[];
  year: string[];
  documentType: string[];
};

// Shape produced by advanced filter builder (include + exclude per dimension).
export type TActiveFilters = {
  includedConcepts: string[];
  includedGeos: string[];
  includedYears: string[];
  includedDocumentTypes: string[];
  excludedConcepts: string[];
  excludedGeos: string[];
  excludedYears: string[];
  excludedDocumentTypes: string[];
};
