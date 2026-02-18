import { Button } from "@base-ui/react/button";
import { useRef, useState, useEffect } from "react";

import { TActiveFilters, TFilterClause, TFilterFieldOptions, TFilterGroup, TFilterOperator } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

const FILTER_FIELDS = [
  { value: "topic", label: "Topic" },
  { value: "geography", label: "Geography" },
  { value: "year", label: "Year" },
  { value: "documentType", label: "Document type" },
] as const;

const DEFAULT_FIELD_OPTIONS: TFilterFieldOptions = {
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
  onApply?: (clauses: TFilterClause[]) => void;
  /** When provided, called with current groups on Apply so parent can persist and pass back as initialGroups. */
  onApplyWithGroups?: (groups: TFilterGroup[]) => void;
  fieldOptions?: TFilterFieldOptions;
  className?: string;
  /** When provided, used to seed state (overrides initialClauses if both given). Enables restoring group structure. */
  initialGroups?: TFilterGroup[];
  /** When provided and initialGroups is not, used to seed state as a single group. */
  initialClauses?: TFilterClause[];
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getValueOptionsForField(field: string, fieldOptions: TFilterFieldOptions): string[] {
  const opts = fieldOptions[field as keyof TFilterFieldOptions];
  return opts ? [...opts] : [];
}

function filterValueOptions(options: string[], query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  return options.filter((opt) => opt.toLowerCase().includes(q));
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

function createEmptyGroup(connector: TFilterGroup["connector"] = null): TFilterGroup {
  return {
    id: crypto.randomUUID(),
    connector,
    clauses: [createEmptyClause(null)],
  };
}

/** Flatten groups to a single clause list for onApply / clausesToActiveFilters. */
function flattenGroups(groups: TFilterGroup[]): TFilterClause[] {
  return groups.flatMap((g) => g.clauses);
}

/**
 * Converts builder clauses into the active-filters shape. "Is" (eq) clauses
 * populate included arrays; "is not" (ne) clauses populate excluded arrays.
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

/** Renders clauses as readable boolean expression, e.g. (Topic is "X") AND (Geography is not "Y"). */
function formatAsBooleanExpression(clauses: TFilterClause[]): string {
  if (clauses.length === 0) return "";

  const conditionParts = clauses.map((clause) => {
    const fieldLabel = FIELD_LABELS[clause.field] ?? clause.field;
    const operatorLabel = clause.operator === "eq" ? "is" : "is not";
    const valueDisplay = clause.value ? `"${clause.value}"` : "…";
    return `${fieldLabel} ${operatorLabel} ${valueDisplay}`;
  });

  return conditionParts.reduce((acc, part, index) => {
    if (index === 0) return part;
    const connector = clauses[index].connector === "or" ? " OR " : " AND ";
    return acc + connector + part;
  }, "");
}

/** Renders groups as (group1) AND (group2), with each group as (c1 AND c2). */
function formatGroupsAsBooleanExpression(groups: TFilterGroup[]): string {
  const groupParts = groups
    .map((group) => {
      const inner = formatAsBooleanExpression(group.clauses);
      return inner ? `(${inner})` : "";
    })
    .filter(Boolean);
  if (groupParts.length === 0) return "";
  return groupParts.reduce((acc, part, index) => {
    if (index === 0) return part;
    const connector = groups[index].connector === "or" ? " OR " : " AND ";
    return acc + connector + part;
  }, "");
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

/** Group clauses by field for summary chips. */
function groupClausesByField(clauses: TFilterClause[]): { field: string; label: string; clauses: TFilterClause[] }[] {
  const byField = new Map<string, TFilterClause[]>();
  for (const clause of clauses) {
    if (!clause.value.trim()) continue;
    const list = byField.get(clause.field) ?? [];
    list.push(clause);
    byField.set(clause.field, list);
  }
  return FILTER_FIELDS.map((f) => ({ field: f.value, label: f.label, clauses: byField.get(f.value) ?? [] })).filter((g) => g.clauses.length > 0);
}

/**
 * Query builder that lets users chain conditions with AND/OR. Each row is one
 * condition (field + is/is not + value). Apply converts clauses into active
 * filters and closes the panel.
 */
function normaliseGroups(groups: TFilterGroup[]): TFilterGroup[] {
  return groups.map((g) => ({
    ...g,
    id: g.id || crypto.randomUUID(),
    clauses: g.clauses.map((c) => ({ ...c, id: c.id || crypto.randomUUID() })),
  }));
}

export function AdvancedFilterQueryBuilder({
  onApply,
  onApplyWithGroups,
  fieldOptions,
  className,
  initialGroups,
  initialClauses,
}: IAdvancedFilterQueryBuilderProps) {
  const options = fieldOptions ?? DEFAULT_FIELD_OPTIONS;
  const [groups, setGroups] = useState<TFilterGroup[]>(() => {
    if (initialGroups?.length) return normaliseGroups(initialGroups);
    const clauses = initialClauses?.length ? initialClauses.map((c) => ({ ...c, id: c.id || crypto.randomUUID() })) : [createEmptyClause(null)];
    return [{ id: crypto.randomUUID(), connector: null, clauses }];
  });
  const [openValueClauseId, setOpenValueClauseId] = useState<string | null>(null);
  const valueDropdownRef = useRef<HTMLDivElement>(null);
  const clauseRowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const flattenedClauses = flattenGroups(groups);
  const flattenedClausesRef = useRef(flattenedClauses);
  const groupsRef = useRef(groups);
  useEffect(() => {
    flattenedClausesRef.current = flattenedClauses;
    groupsRef.current = groups;
  }, [flattenedClauses, groups]);

  useEffect(() => {
    if (openValueClauseId === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (valueDropdownRef.current?.contains(e.target as Node)) return;
      setOpenValueClauseId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openValueClauseId]);

  function addClause(groupId: string) {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, clauses: [...g.clauses, createEmptyClause("and")] } : g)));
  }

  function removeClause(groupId: string, clauseId: string) {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        if (g.clauses.length <= 1) return g;
        const idx = g.clauses.findIndex((c) => c.id === clauseId);
        if (idx < 0) return g;
        const clausesAfter = g.clauses.filter((c) => c.id !== clauseId);
        if (idx === 0 && clausesAfter.length > 0) clausesAfter[0] = { ...clausesAfter[0], connector: null };
        return { ...g, clauses: clausesAfter };
      })
    );
  }

  function updateClause(clauseId: string, patch: Partial<Omit<TFilterClause, "id">>) {
    setGroups((prev) =>
      prev.map((g) => ({
        ...g,
        clauses: g.clauses.map((c) => (c.id === clauseId ? { ...c, ...patch } : c)),
      }))
    );
  }

  function addGroup() {
    setGroups((prev) => [...prev, createEmptyGroup("and")]);
  }

  function removeGroup(groupId: string) {
    setGroups((prev) => {
      if (prev.length <= 1) return prev;
      const after = prev.filter((g) => g.id !== groupId);
      if (after.length > 0 && prev[0]?.id === groupId) after[0] = { ...after[0], connector: null };
      return after;
    });
  }

  function updateGroupConnector(groupId: string, connector: "and" | "or") {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, connector } : g)));
  }

  function clearAll() {
    setGroups([createEmptyGroup(null)]);
  }

  function handleApply() {
    onApply?.(flattenedClauses);
    onApplyWithGroups?.(groups);
  }

  function scrollToClause(id: string) {
    const el = clauseRowRefs.current.get(id);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  const queryPreview = formatGroupsAsBooleanExpression(groups);
  const hasAtLeastOneCompleteClause = flattenedClauses.some((c) => c.value.trim() !== "");
  const summaryGroups = groupClausesByField(flattenedClauses);
  const initialFlattened = initialGroups?.length ? flattenGroups(initialGroups) : (initialClauses ?? []);
  const initialSerial = JSON.stringify(initialFlattened.map((c) => ({ field: c.field, operator: c.operator, value: c.value })));
  const currentSerial = JSON.stringify(flattenedClauses.map((c) => ({ field: c.field, operator: c.operator, value: c.value })));
  const hasUnsavedChanges = currentSerial !== initialSerial;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        const flat = flattenedClausesRef.current;
        if (flat.some((c) => c.value.trim() !== "")) {
          e.preventDefault();
          onApply?.(flat);
          onApplyWithGroups?.(groupsRef.current);
        }
      }
      if ((e.key === "Backspace" || e.key === "Delete") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        clearAll();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onApply, onApplyWithGroups]);

  return (
    <div className={joinTailwindClasses("min-w-[320px] max-w-md", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Advanced filters</p>

      <div className="space-y-4">
        {groups.map((group, groupIndex) => {
          const isFirstGroup = groupIndex === 0;
          return (
            <div key={group.id} className="space-y-2">
              {!isFirstGroup && (
                <div className="flex items-center gap-2">
                  <select
                    aria-label="And / Or between groups"
                    value={group.connector ?? "and"}
                    onChange={(e) => updateGroupConnector(group.id, e.target.value as "and" | "or")}
                    className={joinTailwindClasses(selectInputClasses, "w-16 font-medium text-gray-600")}
                  >
                    {BOOLEAN_CONNECTORS.map((conn) => (
                      <option key={conn.value} value={conn.value}>
                        {conn.label}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-500">between groups</span>
                </div>
              )}
              <div className="rounded-lg border border-gray-200 bg-gray-50/30 p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Group {groupIndex + 1}</span>
                  {groups.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeGroup(group.id)}
                      aria-label="Remove group"
                      className="text-[10px] text-gray-500 hover:text-gray-700"
                    >
                      Remove group
                    </Button>
                  )}
                </div>
                {group.clauses.map((clause, clauseIndex) => {
                  const isFirstClause = clauseIndex === 0;
                  const valueOptions = getValueOptionsForField(clause.field, options);

                  return (
                    <div
                      key={clause.id}
                      ref={(el) => {
                        if (el) clauseRowRefs.current.set(clause.id, el);
                      }}
                      className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-2"
                    >
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

                      <div ref={openValueClauseId === clause.id ? valueDropdownRef : undefined} className="relative min-w-[120px]">
                        <input
                          type="text"
                          aria-label="Value"
                          aria-expanded={openValueClauseId === clause.id}
                          aria-controls={openValueClauseId === clause.id ? `value-listbox-${clause.id}` : undefined}
                          aria-autocomplete="list"
                          role="combobox"
                          placeholder="Type to filter…"
                          value={clause.value}
                          onChange={(e) => updateClause(clause.id, { value: e.target.value })}
                          onFocus={() => setOpenValueClauseId(clause.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setOpenValueClauseId(null);
                          }}
                          className={joinTailwindClasses(selectInputClasses, "w-full")}
                        />
                        {openValueClauseId === clause.id && (
                          <ul
                            id={`value-listbox-${clause.id}`}
                            className="absolute left-0 top-full z-10 mt-1 max-h-48 w-full overflow-auto rounded border border-gray-200 bg-white py-1 shadow-lg"
                            role="listbox"
                          >
                            {(() => {
                              const filtered = filterValueOptions(valueOptions, clause.value);
                              if (filtered.length === 0) {
                                return (
                                  <li className="px-3 py-2 text-sm text-gray-500" role="option" aria-selected="false">
                                    {clause.value.trim() ? "No matches" : "Type to narrow options"}
                                  </li>
                                );
                              }
                              return filtered.map((optionValue) => (
                                <li
                                  key={optionValue}
                                  role="option"
                                  aria-selected={clause.value === optionValue}
                                  className="cursor-pointer px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    updateClause(clause.id, { value: optionValue });
                                    setOpenValueClauseId(null);
                                  }}
                                >
                                  {optionValue}
                                </li>
                              ));
                            })()}
                          </ul>
                        )}
                      </div>

                      <Button
                        type="button"
                        onClick={() => removeClause(group.id, clause.id)}
                        disabled={group.clauses.length <= 1}
                        aria-label="Remove condition"
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
                <Button
                  type="button"
                  onClick={() => addClause(group.id)}
                  className={joinTailwindClasses(
                    "w-full rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600",
                    "hover:border-gray-400 hover:bg-gray-50 transition"
                  )}
                >
                  Add condition in this group
                </Button>
              </div>
            </div>
          );
        })}
        <Button
          type="button"
          onClick={addGroup}
          className={joinTailwindClasses(
            "w-full rounded-lg border border-dashed border-gray-300 bg-gray-50/50 px-3 py-2 text-sm font-medium text-gray-600",
            "hover:border-gray-400 hover:bg-gray-100 transition"
          )}
        >
          Add group
        </Button>
      </div>

      {summaryGroups.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs font-medium text-gray-500">Summary</p>
          <div className="flex flex-wrap gap-2">
            {summaryGroups.map((group) => (
              <div key={group.field} className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-medium uppercase text-gray-400">{group.label}:</span>
                {group.clauses.map((clause) => {
                  const opLabel = clause.operator === "eq" ? "is" : "is not";
                  return (
                    <button
                      key={clause.id}
                      type="button"
                      onClick={() => scrollToClause(clause.id)}
                      className={joinTailwindClasses(
                        "rounded-full border px-2 py-0.5 text-xs transition",
                        clause.operator === "ne"
                          ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                          : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {opLabel} &ldquo;{clause.value}&rdquo;
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {queryPreview && (
        <div className="mt-3 rounded border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-700" role="status" aria-live="polite">
          <span className="text-gray-500">Query: </span>
          {queryPreview}
        </div>
      )}

      {hasUnsavedChanges && hasAtLeastOneCompleteClause && (
        <p className="mt-2 text-xs text-amber-700" role="status">
          Unsaved changes — apply to update search.
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
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
          disabled={!hasAtLeastOneCompleteClause}
          className={joinTailwindClasses(
            "rounded-lg border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-medium text-white",
            "shadow-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
