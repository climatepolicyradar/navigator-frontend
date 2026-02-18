import { TActiveFilters, TFilterClause } from "@/types";

/**
 * Converts advanced-query builder clauses into the active-filters shape.
 * "Is" (eq) clauses populate included arrays; "is not" (ne) clauses populate excluded arrays.
 *
 * @param clauses - Flat list of filter clauses from the query builder
 * @returns Active filters by dimension (included + excluded)
 */
export function clausesToActiveFilters(clauses: TFilterClause[]): TActiveFilters {
  const includedConcepts: string[] = [];
  const includedGeos: string[] = [];
  const includedYears: string[] = [];
  const includedDocumentTypes: string[] = [];
  const excludedConcepts: string[] = [];
  const excludedGeos: string[] = [];
  const excludedYears: string[] = [];
  const excludedDocumentTypes: string[] = [];

  for (const clause of clauses) {
    const value = clause.value.trim();
    if (!value) continue;
    const isExcluded = clause.operator === "ne";
    switch (clause.field) {
      case "topic":
        (isExcluded ? excludedConcepts : includedConcepts).push(value);
        break;
      case "geography":
        (isExcluded ? excludedGeos : includedGeos).push(value);
        break;
      case "year":
        (isExcluded ? excludedYears : includedYears).push(value);
        break;
      case "documentType":
        (isExcluded ? excludedDocumentTypes : includedDocumentTypes).push(value);
        break;
    }
  }

  return {
    includedConcepts,
    includedGeos,
    includedYears,
    includedDocumentTypes,
    excludedConcepts,
    excludedGeos,
    excludedYears,
    excludedDocumentTypes,
  };
}
