import { LucideX, SlidersHorizontal } from "lucide-react";

import { TLabelResult } from "@/hooks/useLabelSearch";

import { TQueryGroup } from "../advancedFilters/AdvancedFilters";

function getTypeOfLabel(label: string, availableFilters: TLabelResult[]): string | null {
  const found = availableFilters.find((f) => f.id === label);
  return found ? found.type : null;
}

// determine if any of the current filters contain any groups, or have any of the settings set to "or", or contain a "not_contains" op rule
function isFilterComplex(filters: TQueryGroup | null | undefined): boolean {
  if (!filters) return false;
  if (filters.op === "or") return true; // using or operator at top level
  if (filters.filters.some((f) => "filters" in f)) return true; // has a subgroup
  if (filters.filters.some((f) => "operator" in f && f.operator === "or")) return true; // has a rule with "or" operator
  if (filters.filters.some((f) => "op" in f && f.op === "not_contains")) return true; // has a rule with "not_contains" operator
  return filters.filters.some((f) => "filters" in f && isFilterComplex(f));
}

function AppliedLabel({ label, type, onSelect, onRemove }: { label: string; type?: string; onSelect: () => void; onRemove: () => void }) {
  return (
    <span className="bg-white rounded-lg inline-flex items-center border border-gray-300 hover:bg-gray-50">
      <button className="py-1 px-2 border-r border-gray-300" onClick={onSelect}>
        <span>{type.slice(0, 1).toUpperCase() + type.replace("_", " ").slice(1)}</span>
      </button>
      <button className="py-1 px-2 border-r border-gray-300" onClick={onSelect}>
        <span>{label.split("::")?.[1]}</span>
      </button>
      <button className="px-2 rounded-r-lg h-7 hover:bg-gray-200" onClick={onRemove}>
        <LucideX width={16} height={16} />
      </button>
    </span>
  );
}

function AppliedDateRange({ value, onSelect, onRemove }: { value: string; onSelect: () => void; onRemove: () => void }) {
  const [startYear, endYear] = value.split(":");
  return (
    <span className="bg-white rounded-lg inline-flex items-center border border-gray-300 hover:bg-gray-50">
      <button className="py-1 px-2 border-r border-gray-300" onClick={onSelect}>
        <span>Date</span>
      </button>
      <button className="py-1 px-2 border-r border-gray-300" onClick={onSelect}>
        <span>
          {startYear} - {endYear}
        </span>
      </button>
      <button className="px-2 rounded-r-lg h-7 hover:bg-gray-200" onClick={onRemove}>
        <LucideX width={16} height={16} />
      </button>
    </span>
  );
}

export function AppliedLabels({
  filters,
  availableFilters,
  labels,
  onClear,
  onSelectLabel,
  onRemoveLabel,
  onAdvancedClick,
  dateRangeValue,
  onSelectDateRange,
  onRemoveDateRange,
}: {
  filters: TQueryGroup;
  availableFilters: TLabelResult[];
  labels: string[];
  onClear?: () => void;
  onRemoveLabel?: (label: string) => void;
  onSelectLabel?: (label: string, type: string) => void;
  onAdvancedClick?: () => void;
  dateRangeValue?: string | null;
  onSelectDateRange?: () => void;
  onRemoveDateRange?: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 text-sm text-gray-700 rounded-lg bg-gray-100 p-2">
      {dateRangeValue && !isFilterComplex(filters) && (
        <AppliedDateRange value={dateRangeValue} onSelect={() => onSelectDateRange?.()} onRemove={() => onRemoveDateRange?.()} />
      )}
      {isFilterComplex(filters) ? (
        <>
          {dateRangeValue && (
            <AppliedDateRange value={dateRangeValue} onSelect={() => onSelectDateRange?.()} onRemove={() => onRemoveDateRange?.()} />
          )}
          <button
            className="bg-white py-1 px-2 rounded-lg inline-flex gap-2 items-center border border-gray-300 hover:bg-gray-50"
            onClick={() => onAdvancedClick?.()}
          >
            <SlidersHorizontal className="text-neutral-400 h-4 w-4" />
            Advanced filters applied
          </button>
        </>
      ) : (
        <>
          {labels.map((label, i) => {
            const type = getTypeOfLabel(label, availableFilters);
            return (
              <AppliedLabel
                key={i}
                label={label}
                type={type || ""}
                onSelect={() => onSelectLabel?.(label, type || "")}
                onRemove={() => onRemoveLabel?.(label)}
              />
            );
          })}
        </>
      )}
      {onClear && (
        <button className="rounded-md px-2 ml-auto hover:bg-gray-200" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
}
