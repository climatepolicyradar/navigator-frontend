import { TActiveFilters, TFilterClause, TFilterGroup } from "@/types";
import type { SelectedFilters } from "@/utils/_experiment/suggestedFilterUtils";

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

/**
 * Converts current applied filters (e.g. from the sidebar) into the advanced
 * builder's group shape so the modal shows the same state. Used so that
 * removing a filter from the sidebar is reflected when the user opens Advanced.
 *
 * @param filters - Current selected filters (included + excluded)
 * @returns One group containing a clause per filter value (or one empty clause if none)
 */
export function selectedFiltersToGroups(filters: SelectedFilters): TFilterGroup[] {
  const clauses: TFilterClause[] = [];

  function pushClause(field: "topic" | "geography" | "year" | "documentType", operator: "eq" | "ne", value: string) {
    if (!value.trim()) return;
    clauses.push({
      id: crypto.randomUUID(),
      connector: clauses.length === 0 ? null : "and",
      field,
      operator,
      value: value.trim(),
    });
  }

  filters.topics.forEach((v) => pushClause("topic", "eq", v));
  filters.geos.forEach((v) => pushClause("geography", "eq", v));
  filters.years.forEach((v) => pushClause("year", "eq", v));
  filters.documentTypes.forEach((v) => pushClause("documentType", "eq", v));
  filters.topicsExcluded.forEach((v) => pushClause("topic", "ne", v));
  filters.geosExcluded.forEach((v) => pushClause("geography", "ne", v));
  filters.yearsExcluded.forEach((v) => pushClause("year", "ne", v));
  filters.documentTypesExcluded.forEach((v) => pushClause("documentType", "ne", v));

  if (clauses.length === 0) {
    return [
      {
        id: crypto.randomUUID(),
        connector: null,
        clauses: [
          {
            id: crypto.randomUUID(),
            connector: null,
            field: "topic",
            operator: "eq",
            value: "",
          },
        ],
      },
    ];
  }

  return [
    {
      id: crypto.randomUUID(),
      connector: null,
      clauses,
    },
  ];
}
