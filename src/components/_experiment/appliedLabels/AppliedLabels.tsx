import { LucideX, SlidersHorizontal } from "lucide-react";

import { TLabelResult } from "@/hooks/useLabelSearch";

function getTypeOfLabel(label: string, availableFilters: TLabelResult[]): string | null {
  const found = availableFilters.find((f) => f.id === label);
  return found ? found.type : null;
}

type TProps = {
  availableFilters: TLabelResult[];
  labels: string[];
  summariseAsAdvancedOnly: boolean;
  onClear?: () => void;
  onRemoveLabel?: (label: string) => void;
  onSelectLabel?: (label: string, type: string) => void;
  onAdvancedClick?: () => void;
  dateRangeValue?: string | null;
  onSelectDateRange?: () => void;
  onRemoveDateRange?: () => void;
};

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
  availableFilters,
  labels,
  summariseAsAdvancedOnly,
  onClear,
  onSelectLabel,
  onRemoveLabel,
  onAdvancedClick,
  dateRangeValue,
  onSelectDateRange,
  onRemoveDateRange,
}: TProps) {
  return (
    <div className="flex flex-wrap gap-1 text-sm text-gray-700 rounded-lg bg-gray-100 p-2">
      {dateRangeValue && !summariseAsAdvancedOnly && (
        <AppliedDateRange value={dateRangeValue} onSelect={() => onSelectDateRange?.()} onRemove={() => onRemoveDateRange?.()} />
      )}
      {summariseAsAdvancedOnly ? (
        <>
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
