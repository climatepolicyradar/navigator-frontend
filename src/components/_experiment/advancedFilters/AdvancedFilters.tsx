import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Plus, Trash2, X } from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import { useLabelSearch, TLabelResult } from "@/hooks/useLabelSearch";
import {
  DATE_RANGE_MIN_YEAR,
  parseYearRange,
  resolveYearRangeForPreset,
  serialiseYearRange,
  TDateRangePreset,
} from "@/utils/_experiment/dateRangeFilters";
import { partitionByAvailability } from "@/utils/_experiment/labelAggregationAvailability";
import { labelTypeLabel } from "@/utils/_experiment/labelTypeLabel";
import { joinTailwindClasses } from "@/utils/tailwind";

export type TQueryGroup = {
  op: "and" | "or";
  filters: (TQueryGroup | TQueryRule)[];
};

export type TQueryRule =
  | {
      field: "labels.value.id" | "attributes.status";
      op: "contains" | "not_contains" | "eq";
      value: string;
    }
  | {
      field: "attributes.published_date";
      key: "published_date";
      op: "eq" | "not_eq" | "lt" | "lte" | "gt" | "gte";
      value: string;
    };

function isRule(node: TQueryGroup | TQueryRule): node is TQueryRule {
  return "field" in node;
}

export function isFilterGroupEmpty(filters: TQueryGroup | null): boolean {
  if (!filters) return true;
  if (filters.filters.length === 0) return true;
  return filters.filters.some((f) => isRule(f) && f.value === "");
}

// ID helpers (stable keys for React lists)
let _nextId = 1;
const nodeIds = new WeakMap<object, number>();
function nodeId(node: TQueryGroup | TQueryRule): number {
  let id = nodeIds.get(node);
  if (id === undefined) {
    id = _nextId++;
    nodeIds.set(node, id);
  }
  return id;
}

// Immutable tree helpers (produce new references on every change)

function createRule(): TQueryRule {
  return { field: "labels.value.id", op: "contains", value: "" };
}

export function createGroup(): TQueryGroup {
  return { op: "and", filters: [createRule()] };
}

/** Deep-clone + replace a node at a specific path. */
function updateAtPath(
  root: TQueryGroup,
  path: number[],
  updater: (node: TQueryGroup | TQueryRule) => TQueryGroup | TQueryRule | null
): TQueryGroup | null {
  if (path.length === 0) {
    const result = updater(root);
    return result && !isRule(result) ? result : root;
  }

  const [head, ...rest] = path;
  const newFilters = [...root.filters];

  if (rest.length === 0) {
    const result = updater(newFilters[head]);
    if (result === null) {
      newFilters.splice(head, 1);
    } else {
      newFilters[head] = result;
    }
  } else {
    const child = newFilters[head];
    if (!isRule(child)) {
      const updated = updateAtPath(child, rest, updater);
      if (updated === null) {
        newFilters.splice(head, 1);
      } else {
        newFilters[head] = updated;
      }
    }
  }

  // If a group becomes empty after a deletion, remove it too
  if (newFilters.length === 0) return null;

  return { ...root, filters: newFilters };
}

function addAtPath(root: TQueryGroup, path: number[], item: TQueryGroup | TQueryRule): TQueryGroup {
  if (path.length === 0) {
    return { ...root, filters: [...root.filters, item] };
  }

  const [head, ...rest] = path;
  const newFilters = [...root.filters];
  const child = newFilters[head];
  if (!isRule(child)) {
    newFilters[head] = addAtPath(child, rest, item);
  }
  return { ...root, filters: newFilters };
}

// Label Picker (inline dropdown with search — powered by useLabelSearch)
interface LabelPickerProps {
  value: string;
  onChange: (label: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  /** When set, labels not in the set are shown but disabled. */
  availableLabelIds?: ReadonlySet<string> | undefined;
}

function LabelPicker({ value, onChange, placeholder = "Search...", autoFocus = false, availableLabelIds }: LabelPickerProps) {
  const [inputValue, setInputValue] = useState(value ? "" : "");
  const [isOpen, setIsOpen] = useState(autoFocus);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, isLoading } = useLabelSearch(inputValue);

  const isResultAvailable = (label: TLabelResult) => !availableLabelIds || availableLabelIds.has(label.id);
  const { enabled: enabledResults, disabled: disabledResults } = partitionByAvailability(results, availableLabelIds);
  const orderedResults: TLabelResult[] = [...enabledResults, ...disabledResults];
  const navIndex = activeIndex >= 0 && activeIndex < orderedResults.length ? activeIndex : -1;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (label: TLabelResult) => {
      onChange(label.value);
      setInputValue("");
      setIsOpen(false);
      setActiveIndex(-1);
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || orderedResults.length === 0) return;
    const len = orderedResults.length;
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const cur = navIndex;
        setActiveIndex(cur < len - 1 ? cur + 1 : 0);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const cur = navIndex;
        setActiveIndex(cur > 0 ? cur - 1 : len - 1);
        break;
      }
      case "Enter":
        e.preventDefault();
        if (navIndex >= 0 && orderedResults[navIndex] && isResultAvailable(orderedResults[navIndex])) {
          handleSelect(orderedResults[navIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // If there's already a value selected, show it as a chip
  if (value) {
    return (
      <button
        type="button"
        onClick={() => {
          onChange("");
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="text-left inline-flex items-center gap-1 rounded bg-gray-100 text-gray-700 px-2 py-2 text-xs font-medium hover:bg-red-100 transition-colors"
      >
        {value}
        <X className="h-3 w-3" />
      </button>
    );
  }

  return (
    <div ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={joinTailwindClasses(
          "w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800",
          "placeholder:text-gray-400",
          "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200"
        )}
        autoComplete="off"
      />
      {isLoading && (
        <div className="absolute right-2 top-1.5">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
        </div>
      )}
      {isOpen && orderedResults.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-48 w-75 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {orderedResults.map((label, idx) => {
            const isAvailable = isResultAvailable(label);
            return (
              <Fragment key={label.id}>
                {disabledResults.length > 0 && enabledResults.length > 0 && idx === enabledResults.length ? (
                  <div className="h-6" aria-hidden />
                ) : null}
                <li
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (!isAvailable) return;
                    handleSelect(label);
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={joinTailwindClasses(
                    "px-3 py-1.5 text-sm",
                    isAvailable ? "cursor-pointer" : "cursor-not-allowed",
                    idx === navIndex
                      ? isAvailable
                        ? "bg-blue-50 text-blue-800"
                        : "bg-gray-50 text-neutral-400"
                      : isAvailable
                        ? "text-gray-700 hover:bg-gray-50"
                        : "text-neutral-400"
                  )}
                >
                  <span className="font-medium">{label.value}</span>
                  <span className={joinTailwindClasses("ml-2 text-xs", isAvailable ? "text-gray-400" : "text-neutral-400")}>
                    - {labelTypeLabel(label.type)}
                  </span>
                </li>
              </Fragment>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Operator selector
const OPERATORS = [
  { value: "contains" as const, label: "is" },
  { value: "not_contains" as const, label: "is not" },
];

function OperatorSelect({ value, onChange }: { value: "contains" | "not_contains"; onChange: (op: "contains" | "not_contains") => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as "contains" | "not_contains")}
      className={joinTailwindClasses(
        "rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700",
        "focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200",
        "cursor-pointer"
      )}
    >
      {OPERATORS.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
    </select>
  );
}

const DATE_RANGE_PRESETS: Array<{ value: TDateRangePreset; label: string }> = [
  { value: "all_time", label: "All time" },
  { value: "last_year", label: "In last year" },
  { value: "last_5_years", label: "In last 5 years" },
  { value: "custom", label: "Specify range" },
];

type TDateRangePickerProps = {
  value: string;
  onChange: (value: string) => void;
};

function DateRangePicker({ value, onChange }: TDateRangePickerProps) {
  const yearNow = new Date().getFullYear();
  const parsedRange = parseYearRange(value) ?? resolveYearRangeForPreset("last_year", yearNow);
  const [customStartYear, setCustomStartYear] = useState(parsedRange.startYear.toString());
  const [customEndYear, setCustomEndYear] = useState(parsedRange.endYear.toString());

  const isLastYear = parsedRange.startYear === yearNow - 1 && parsedRange.endYear === yearNow;
  const isLastFiveYears = parsedRange.startYear === yearNow - 5 && parsedRange.endYear === yearNow;
  const isAllTime = parsedRange.startYear <= DATE_RANGE_MIN_YEAR && parsedRange.endYear === yearNow;
  const selectedPreset: TDateRangePreset = isAllTime ? "all_time" : isLastYear ? "last_year" : isLastFiveYears ? "last_5_years" : "custom";

  const applyPreset = (preset: TDateRangePreset) => {
    if (preset === "custom") {
      onChange(serialiseYearRange(parsedRange.startYear, parsedRange.endYear));
      return;
    }
    const range = resolveYearRangeForPreset(preset, yearNow);
    onChange(serialiseYearRange(range.startYear, range.endYear));
  };

  const applyCustomRange = () => {
    const nextStartYear = Number(customStartYear);
    const nextEndYear = Number(customEndYear);
    if (!Number.isInteger(nextStartYear) || !Number.isInteger(nextEndYear)) return;
    if (nextStartYear > nextEndYear) return;
    if (nextStartYear < DATE_RANGE_MIN_YEAR) return;
    if (nextEndYear > yearNow) return;
    onChange(serialiseYearRange(nextStartYear, nextEndYear));
  };

  return (
    <div className="rounded border border-gray-200 p-2 text-inky-black">
      <div className="flex flex-col gap-1">
        {DATE_RANGE_PRESETS.map((preset) => (
          <label key={preset.value} className="inline-flex items-center gap-2 text-xs text-inky-black">
            <input type="radio" checked={selectedPreset === preset.value} onChange={() => applyPreset(preset.value)} className="h-3.5 w-3.5" />
            {preset.label}
          </label>
        ))}
      </div>
      {selectedPreset === "custom" && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="number"
            min={DATE_RANGE_MIN_YEAR}
            max={yearNow}
            value={customStartYear}
            onChange={(event) => setCustomStartYear(event.target.value)}
            onBlur={applyCustomRange}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-inky-black"
          />
          <input
            type="number"
            min={DATE_RANGE_MIN_YEAR}
            max={yearNow}
            value={customEndYear}
            onChange={(event) => setCustomEndYear(event.target.value)}
            onBlur={applyCustomRange}
            className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-inky-black"
          />
        </div>
      )}
    </div>
  );
}

// Boolean connector pill (AND / OR)
function ConnectorPill({ value, onChange }: { value: "and" | "or"; onChange: (v: "and" | "or") => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(value === "and" ? "or" : "and")}
      className={joinTailwindClasses(
        "rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wide transition-colors",
        value === "and" ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
      )}
    >
      {value}
    </button>
  );
}

// Rule row
interface RuleRowProps {
  rule: TQueryRule;
  onUpdate: (updated: TQueryRule) => void;
  onDelete: () => void;
  isOnly: boolean;
  availableLabelIds?: ReadonlySet<string> | undefined;
}

function RuleRow({ rule, onUpdate, onDelete, isOnly, availableLabelIds }: RuleRowProps) {
  const isLabelRule = rule.field === "labels.value.id";
  const isPublishedDateRule = rule.field === "attributes.published_date";

  return (
    <div className="flex items-center gap-2 group">
      <select
        value={rule.field}
        onChange={(event) => {
          if (event.target.value === "attributes.published_date") {
            const currentYear = new Date().getFullYear();
            onUpdate({
              field: "attributes.published_date",
              op: "between",
              value: serialiseYearRange(currentYear - 1, currentYear),
            });
            return;
          }
          onUpdate({ field: "labels.value.id", op: "contains", value: "" });
        }}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm font-medium text-gray-700"
      >
        <option value="labels.value.id">Label</option>
        <option value="attributes.published_date">Published date</option>
      </select>
      {isLabelRule && (
        <>
          <OperatorSelect value={rule.op} onChange={(op) => onUpdate({ ...rule, op })} />
          <div className="min-w-45 min-h-7.5">
            <LabelPicker
              value={rule.value}
              onChange={(value) => onUpdate({ ...rule, value })}
              autoFocus={!rule.value}
              availableLabelIds={availableLabelIds}
            />
          </div>
        </>
      )}
      {isPublishedDateRule && (
        <div className="min-w-70">
          <DateRangePicker value={rule.value} onChange={(value) => onUpdate({ ...rule, value, op: "between" })} />
        </div>
      )}
      {!isOnly && (
        <button
          type="button"
          onClick={onDelete}
          className="justify-end p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Remove rule"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// Group renderer (recursive)
interface GroupRendererProps {
  group: TQueryGroup;
  path: number[];
  root: TQueryGroup;
  onChange: (newRoot: TQueryGroup) => void;
  depth: number;
  onDeleteGroup?: () => void;
  availableLabelIds?: ReadonlySet<string> | undefined;
}

function GroupRenderer({ group, path, root, onChange, depth, onDeleteGroup, availableLabelIds }: GroupRendererProps) {
  const borderColors = ["border-l-blue-200", "border-l-violet-200", "border-l-amber-200", "border-l-emerald-200", "border-l-rose-200"];
  const bgColors = ["bg-blue-50/30", "bg-violet-50/30", "bg-amber-50/30", "bg-emerald-50/30", "bg-rose-50/30"];
  const borderColor = borderColors[depth % borderColors.length];
  const bgColor = bgColors[depth % bgColors.length];

  const handleUpdateNode = (index: number, updatedNode: TQueryGroup | TQueryRule) => {
    const updated = updateAtPath(root, [...path, index], () => updatedNode);
    if (updated) onChange(updated);
  };

  const handleDeleteNode = (index: number) => {
    const updated = updateAtPath(root, [...path, index], () => null);
    if (updated) {
      onChange(updated);
    } else if (onDeleteGroup) {
      // Group became empty — delete the group itself
      onDeleteGroup();
    }
  };

  const handleAddRule = () => {
    onChange(addAtPath(root, path, createRule()));
  };

  const handleAddGroup = () => {
    onChange(addAtPath(root, path, createGroup()));
  };

  const handleChangeOp = (op: "and" | "or") => {
    const updated = updateAtPath(root, path, (node) => (!isRule(node) ? { ...node, op } : node));
    if (updated) onChange(updated);
  };

  return (
    <div className={joinTailwindClasses("rounded-lg border-l-[3px] pl-4 pr-2 py-3 space-y-2", borderColor, bgColor)}>
      {/* Group header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Group</span>
          <ConnectorPill value={group.op} onChange={handleChangeOp} />
        </div>
        {onDeleteGroup && (
          <button
            type="button"
            onClick={onDeleteGroup}
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Remove group"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-2">
        {group.filters.map((child, index) => {
          const key = nodeId(child);

          if (isRule(child)) {
            return (
              <div key={key}>
                {index > 0 && (
                  <div className="flex items-center gap-2 py-1">
                    <div className="flex-1 border-t border-dashed border-gray-200" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{group.op}</span>
                    <div className="flex-1 border-t border-dashed border-gray-200" />
                  </div>
                )}
                <RuleRow
                  rule={child}
                  onUpdate={(updated) => handleUpdateNode(index, updated)}
                  onDelete={() => handleDeleteNode(index)}
                  isOnly={group.filters.length === 1}
                  availableLabelIds={availableLabelIds}
                />
              </div>
            );
          }

          // Nested group
          return (
            <div key={key}>
              {index > 0 && (
                <div className="flex items-center gap-2 py-1">
                  <div className="flex-1 border-t border-dashed border-gray-200" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{group.op}</span>
                  <div className="flex-1 border-t border-dashed border-gray-200" />
                </div>
              )}
              <GroupRenderer
                group={child}
                path={[...path, index]}
                root={root}
                onChange={onChange}
                depth={depth + 1}
                onDeleteGroup={() => handleDeleteNode(index)}
                availableLabelIds={availableLabelIds}
              />
            </div>
          );
        })}
      </div>

      {/* Add buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleAddRule}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-gray-300 px-2 py-1 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
        >
          <Plus className="h-3 w-3" />
          Rule
        </button>
        <button
          type="button"
          onClick={handleAddGroup}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-gray-300 px-2 py-1 text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
        >
          <Plus className="h-3 w-3" />
          Group
        </button>
      </div>
    </div>
  );
}

type TProps = {
  filters?: TQueryGroup | null;
  setFilters?: (filters: TQueryGroup | null) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  availableLabelIds?: ReadonlySet<string> | undefined;
};

export function AdvancedFilters({ filters, setFilters, open, onOpenChange, availableLabelIds }: TProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 min-h-dvh bg-inky-black opacity-20 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:opacity-70 supports-[-webkit-touch-callout:none]:absolute" />
        <BaseDialog.Popup className="w-3/4 max-w-4xl fixed top-1/5 left-1/2 -translate-x-1/2 rounded-xl border border-transparent-regular bg-white shadow-2xl focus-visible:outline-none  transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 ">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">Advanced Filters</h3>
            <BaseDialog.Close className="rounded p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Close">
              <X className="h-4 w-4" />
            </BaseDialog.Close>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto p-4">
            <GroupRenderer group={filters} path={[]} root={filters} onChange={setFilters} depth={0} availableLabelIds={availableLabelIds} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <button type="button" onClick={() => setFilters(createGroup())} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
              Reset all
            </button>
            <div className="text-[10px] text-gray-400">
              {countRules(filters)} rule{countRules(filters) !== 1 && "s"}
            </div>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

function countRules(node: TQueryGroup | TQueryRule): number {
  if (isRule(node)) return 1;
  return node.filters.reduce((sum, child) => sum + countRules(child), 0);
}
