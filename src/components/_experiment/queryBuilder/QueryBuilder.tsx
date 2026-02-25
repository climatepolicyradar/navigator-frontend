import { Popover as BasePopover } from "@base-ui/react/popover";
import { ListFilter, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLabelSearch, TLabelResult } from "@/hooks/useLabelSearch";
import { joinTailwindClasses } from "@/utils/tailwind";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TQueryGroup = {
  op: "and" | "or";
  filters: (TQueryGroup | TQueryRule)[];
};

type TQueryRule = {
  field: "labels.label.id";
  op: "contains" | "not_contains";
  value: string;
};

function isRule(node: TQueryGroup | TQueryRule): node is TQueryRule {
  return "field" in node;
}

// ---------------------------------------------------------------------------
// ID helpers (stable keys for React lists)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Immutable tree helpers (produce new references on every change)
// ---------------------------------------------------------------------------

function createRule(): TQueryRule {
  return { field: "labels.label.id", op: "contains", value: "" };
}

function createGroup(): TQueryGroup {
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

// ---------------------------------------------------------------------------
// Label Picker (inline dropdown with search — powered by useLabelSearch)
// ---------------------------------------------------------------------------

interface LabelPickerProps {
  value: string;
  onChange: (label: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

function LabelPicker({ value, onChange, placeholder = "Search...", autoFocus = false }: LabelPickerProps) {
  const [inputValue, setInputValue] = useState(value ? "" : "");
  const [isOpen, setIsOpen] = useState(autoFocus);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, isLoading } = useLabelSearch(inputValue);

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
      onChange(label.id);
      setInputValue("");
      setIsOpen(false);
      setActiveIndex(-1);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => (i < results.length - 1 ? i + 1 : 0));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => (i > 0 ? i - 1 : results.length - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && results[activeIndex]) {
            handleSelect(results[activeIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
      }
    },
    [isOpen, results, activeIndex, handleSelect]
  );

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
    <div ref={containerRef} className="relative">
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
      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {results.map((label, idx) => (
            <li
              key={label.id}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(label)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={joinTailwindClasses(
                "cursor-pointer px-3 py-1.5 text-sm",
                idx === activeIndex ? "bg-blue-50 text-blue-800" : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <span className="font-medium">{label.id}</span>
              <span className="ml-2 text-gray-400 text-xs">{label.type}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Operator selector
// ---------------------------------------------------------------------------

const OPERATORS = [
  { value: "contains" as const, label: "is" },
  { value: "not_contains" as const, label: "is not" },
];

function OperatorSelect({ value, onChange }: { value: TQueryRule["op"]; onChange: (op: TQueryRule["op"]) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as TQueryRule["op"])}
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

// ---------------------------------------------------------------------------
// Boolean connector pill (AND / OR)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Rule row
// ---------------------------------------------------------------------------

interface RuleRowProps {
  rule: TQueryRule;
  onUpdate: (updated: TQueryRule) => void;
  onDelete: () => void;
  isOnly: boolean;
}

function RuleRow({ rule, onUpdate, onDelete, isOnly }: RuleRowProps) {
  return (
    <div className="flex items-center gap-2 group">
      <span className="text-xs text-gray-500 font-medium shrink-0 w-10">Label</span>
      <OperatorSelect value={rule.op} onChange={(op) => onUpdate({ ...rule, op })} />
      <div className="min-w-45 min-h-7.5">
        <LabelPicker value={rule.value} onChange={(value) => onUpdate({ ...rule, value })} autoFocus={!rule.value} />
      </div>
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

// ---------------------------------------------------------------------------
// Group renderer (recursive)
// ---------------------------------------------------------------------------

interface GroupRendererProps {
  group: TQueryGroup;
  path: number[];
  root: TQueryGroup;
  onChange: (newRoot: TQueryGroup) => void;
  depth: number;
  onDeleteGroup?: () => void;
}

function GroupRenderer({ group, path, root, onChange, depth, onDeleteGroup }: GroupRendererProps) {
  const borderColors = ["border-l-blue-400", "border-l-violet-400", "border-l-amber-400", "border-l-emerald-400", "border-l-rose-400"];
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

// ---------------------------------------------------------------------------
// Main QueryBuilder component
// ---------------------------------------------------------------------------

export function QueryBuilder() {
  const [query, setQuery] = useState<TQueryGroup>(createGroup());

  // Log query to console whenever it changes
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("QueryBuilder output:", JSON.stringify(query, null, 2));
  }, [query]);

  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        className={joinTailwindClasses(
          "inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm",
          "hover:bg-gray-50 hover:border-gray-400 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        )}
      >
        <ListFilter className="h-4 w-4" />
        Filters
      </BasePopover.Trigger>

      <BasePopover.Portal>
        <BasePopover.Positioner positionMethod="fixed" sideOffset={8} side="bottom" align="start" className="z-50">
          <BasePopover.Popup
            className={joinTailwindClasses("w-130 rounded-xl border border-gray-200 bg-white shadow-2xl", "focus-visible:outline-none")}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Advanced filters</h3>
              <BasePopover.Close className="rounded p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" aria-label="Close">
                <X className="h-4 w-4" />
              </BasePopover.Close>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              <GroupRenderer group={query} path={[]} root={query} onChange={setQuery} depth={0} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
              <button type="button" onClick={() => setQuery(createGroup())} className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                Reset all
              </button>
              <div className="text-[10px] text-gray-400">
                {countRules(query)} rule{countRules(query) !== 1 && "s"}
              </div>
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

/** Count the total number of rules in the tree. */
function countRules(node: TQueryGroup | TQueryRule): number {
  if (isRule(node)) return 1;
  return node.filters.reduce((sum, child) => sum + countRules(child), 0);
}

export type { TQueryGroup, TQueryRule };
export default QueryBuilder;
