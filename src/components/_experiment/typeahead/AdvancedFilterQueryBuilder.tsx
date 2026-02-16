import { Button } from "@base-ui/react/button";
import { useState } from "react";

import { TActiveFilters, TFilterClause, TFilterOperator } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

const FILTER_FIELDS = [
  { value: "topic", label: "Topic" },
  { value: "geography", label: "Geography" },
  { value: "year", label: "Year" },
  { value: "documentType", label: "Document type" },
] as const;

const FIELD_OPTIONS: Record<string, readonly string[]> = {
  topic: ["flood defence", "targets"],
  geography: ["spain", "france", "germany"],
  year: ["2020", "2021", "2022", "2023", "2024"],
  documentType: ["laws", "policies", "reports", "litigation"],
};

const BOOLEAN_CONNECTORS = [
  { value: "and", label: "AND" },
  { value: "or", label: "OR" },
] as const;

const CONDITION_OPERATORS = [
  { value: "eq", label: "is" },
  { value: "ne", label: "is not" },
] as const;

const FIELD_LABELS: Record<string, string> = Object.fromEntries(FILTER_FIELDS.map((f) => [f.value, f.label]));

const selectInputClasses = joinTailwindClasses(
  "rounded border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-800",
  "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
);

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface IAdvancedFilterQueryBuilderProps {
  // Called when the user clicks Apply with the current clauses.
  onApply?: (clauses: TFilterClause[]) => void;
  className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getValueOptionsForField(field: string): string[] {
  return [...(FIELD_OPTIONS[field] ?? [])];
}

function createEmptyClause(connector: TFilterClause["connector"] = null): TFilterClause {
  return {
    id: crypto.randomUUID(),
    connector,
    field: "topic",
    operator: "eq",
    value: "",
  };
}

/**
 * Converts builder clauses into the active-filters shape. Only "is" (eq) clauses
 * with a value are included; "is not" (ne) is not yet supported by active filters.
 */
export function clausesToActiveFilters(clauses: TFilterClause[]): TActiveFilters {
  const concepts: string[] = [];
  const geos: string[] = [];
  const years: string[] = [];
  const documentTypes: string[] = [];

  for (const clause of clauses) {
    if (clause.operator !== "eq" || !clause.value.trim()) continue;
    const value = clause.value.trim();
    switch (clause.field) {
      case "topic":
        concepts.push(value);
        break;
      case "geography":
        geos.push(value);
        break;
      case "year":
        years.push(value);
        break;
      case "documentType":
        documentTypes.push(value);
        break;
    }
  }

  return { concepts, geos, years, documentTypes };
}

/** Renders clauses as readable boolean expression, e.g. (Topic is "X") AND (Geography is not "Y"). */
function formatAsBooleanExpression(clauses: TFilterClause[]): string {
  if (clauses.length === 0) return "";

  const conditionParts = clauses.map((clause) => {
    const fieldLabel = FIELD_LABELS[clause.field] ?? clause.field;
    const operatorLabel = clause.operator === "eq" ? "is" : "is not";
    const valueDisplay = clause.value ? `"${clause.value}"` : "…";
    return `(${fieldLabel} ${operatorLabel} ${valueDisplay})`;
  });

  return conditionParts.reduce((acc, part, index) => {
    if (index === 0) return part;
    const connector = clauses[index].connector === "or" ? " OR " : " AND ";
    return acc + connector + part;
  }, "");
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/**
 * Query builder that lets users chain conditions with AND/OR. Each row is one
 * condition (field + is/is not + value). Apply converts clauses into active
 * filters and closes the panel.
 */
export function AdvancedFilterQueryBuilder({ onApply, className }: IAdvancedFilterQueryBuilderProps) {
  const [clauses, setClauses] = useState<TFilterClause[]>(() => [createEmptyClause(null)]);

  function addClause() {
    setClauses((currentClauses) => [...currentClauses, createEmptyClause("and")]);
  }

  function removeClause(id: string) {
    setClauses((currentClauses) => {
      if (currentClauses.length <= 1) return currentClauses;
      const removedIndex = currentClauses.findIndex((clause) => clause.id === id);
      if (removedIndex < 0) return currentClauses;
      const clausesAfterRemoval = currentClauses.filter((clause) => clause.id !== id);
      if (removedIndex === 0 && clausesAfterRemoval.length > 0) {
        clausesAfterRemoval[0] = { ...clausesAfterRemoval[0], connector: null };
      }
      return clausesAfterRemoval;
    });
  }

  function updateClause(id: string, patch: Partial<Omit<TFilterClause, "id">>) {
    setClauses((currentClauses) => currentClauses.map((clause) => (clause.id === id ? { ...clause, ...patch } : clause)));
  }

  function clearAll() {
    setClauses([createEmptyClause(null)]);
  }

  function handleApply() {
    onApply?.(clauses);
  }

  const queryPreview = formatAsBooleanExpression(clauses);
  const hasAtLeastOneCompleteClause = clauses.some((clause) => clause.value.trim() !== "");
  const showApplyAndClearAll = hasAtLeastOneCompleteClause;

  return (
    <div className={joinTailwindClasses("min-w-[320px] max-w-md", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Advanced filters</p>

      <div className="space-y-2">
        {clauses.map((clause, index) => {
          const isFirstClause = index === 0;
          const valueOptions = getValueOptionsForField(clause.field);

          return (
            <div key={clause.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 p-2">
              {!isFirstClause && (
                <select
                  aria-label="And / Or"
                  value={clause.connector ?? "and"}
                  onChange={(e) =>
                    updateClause(clause.id, {
                      connector: e.target.value as "and" | "or",
                    })
                  }
                  className={joinTailwindClasses(selectInputClasses, "w-16 font-medium text-gray-600")}
                >
                  {BOOLEAN_CONNECTORS.map((conn) => (
                    <option key={conn.value} value={conn.value}>
                      {conn.label}
                    </option>
                  ))}
                </select>
              )}

              <select
                aria-label="Filter field"
                value={clause.field}
                onChange={(e) => updateClause(clause.id, { field: e.target.value, value: "" })}
                className={selectInputClasses}
              >
                {FILTER_FIELDS.map((field) => (
                  <option key={field.value} value={field.value}>
                    {field.label}
                  </option>
                ))}
              </select>

              <select
                aria-label="Is / Is not"
                value={clause.operator}
                onChange={(e) => updateClause(clause.id, { operator: e.target.value as TFilterOperator })}
                className={joinTailwindClasses(selectInputClasses, "w-20")}
              >
                {CONDITION_OPERATORS.map((op) => (
                  <option key={op.value} value={op.value}>
                    {op.label}
                  </option>
                ))}
              </select>

              <select
                aria-label="Value"
                value={clause.value}
                onChange={(e) => updateClause(clause.id, { value: e.target.value })}
                className={joinTailwindClasses(selectInputClasses, "min-w-[100px]")}
              >
                <option value="">Select…</option>
                {valueOptions.map((optionValue) => (
                  <option key={optionValue} value={optionValue}>
                    {optionValue}
                  </option>
                ))}
              </select>

              <Button
                type="button"
                onClick={() => removeClause(clause.id)}
                disabled={clauses.length <= 1}
                aria-label="Remove clause"
                className={joinTailwindClasses(
                  "ml-auto rounded p-1.5 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700",
                  "disabled:opacity-50 disabled:hover:bg-transparent"
                )}
              >
                ×
              </Button>
            </div>
          );
        })}
      </div>

      {queryPreview && (
        <div className="mt-3 rounded border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700" role="status" aria-live="polite">
          <span className="text-gray-500">Query: </span>
          {queryPreview}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={addClause}
          className={joinTailwindClasses(
            "rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700",
            "shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
          )}
        >
          Add condition
        </Button>
        {showApplyAndClearAll && (
          <>
            <Button
              type="button"
              onClick={clearAll}
              className={joinTailwindClasses(
                "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600",
                "hover:bg-gray-50 transition"
              )}
            >
              Clear all
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className={joinTailwindClasses(
                "rounded-lg border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white",
                "shadow-sm transition hover:bg-blue-700"
              )}
            >
              Apply
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
