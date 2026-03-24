import { LucideX } from "lucide-react";

import { TLabelResult } from "@/hooks/useLabelSearch";

function getTypeOfLabel(label: string, availableFilters: TLabelResult[]): string | null {
  const found = availableFilters.find((f) => f.value === label);
  return found ? found.type : null;
}

function AppliedLabel({ label, type, onSelect, onRemove }: { label: string; type?: string; onSelect: () => void; onRemove: () => void }) {
  return (
    <span className="bg-white rounded-lg inline-flex items-center border border-gray-300 hover:bg-gray-50">
      <button className="py-1 px-2 border-r border-gray-300" onClick={onSelect}>
        <span>{type.slice(0, 1).toUpperCase() + type.replace("_", " ").slice(1)}</span>
      </button>
      <button className="py-1 px-2 border-r border-gray-300" onClick={onSelect}>
        <span>{label}</span>
      </button>
      <button className="px-2 rounded-r-lg h-[28px] hover:bg-gray-200" onClick={onRemove}>
        <LucideX width={16} height={16} />
      </button>
    </span>
  );
}

export function AppliedLabels({
  availableFilters,
  // query,
  labels,
  onClear,
  // setQuery,
  onSelectLabel,
  onRemoveLabel,
}: {
  availableFilters: TLabelResult[];
  query: string;
  labels: string[];
  onClear?: () => void;
  setQuery?: (query: string) => void;
  onRemoveLabel?: (label: string) => void;
  onSelectLabel?: (label: string, type: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 text-sm text-gray-700 rounded-lg bg-gray-100 p-2">
      {/* {query && (
        <AppliedLabel type="Keyword" label={`Anything matching "${query}"`} onSelect={() => setQuery?.("")} onRemove={() => setQuery?.("")} />
      )} */}
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
      <button className="rounded-xl px-2 ml-2 justify-self-end hover:bg-gray-200" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
