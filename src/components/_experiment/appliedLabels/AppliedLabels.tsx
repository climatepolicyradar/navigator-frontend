import { LucideX } from "lucide-react";

import { TLabelResult } from "@/hooks/useLabelSearch";

function getTypeOfLabel(label: string, availableFilters: TLabelResult[]): string | null {
  const found = availableFilters.find((f) => f.value === label);
  return found ? found.type : null;
}

function AppliedLabel({ label, onSelect, onRemove }: { label: string; onSelect: () => void; onRemove: () => void }) {
  return (
    <span className="bg-gray-50 rounded inline-flex items-center gap-1 border border-gray-100 hover:bg-gray-100">
      <button className="py-2 pl-3" onClick={onSelect}>
        <span>{label}</span>
      </button>
      <button className="rounded p-1.5 mr-1 hover:bg-gray-200" onClick={onRemove}>
        <LucideX width={14} height={14} />
      </button>
    </span>
  );
}

export function AppliedLabels({
  availableFilters,
  query,
  labels,
  onSelectLabel,
  onRemoveLabel,
  setQuery,
}: {
  availableFilters: TLabelResult[];
  query: string;
  labels: string[];
  onSelectLabel?: (label: string, type: string) => void;
  onRemoveLabel?: (label: string) => void;
  setQuery?: (query: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 text-sm">
      {query && <AppliedLabel label={`Anything matching "${query}"`} onSelect={() => setQuery?.("")} onRemove={() => setQuery?.("")} />}
      {labels.map((label, i) => (
        <AppliedLabel
          key={i}
          label={label}
          onSelect={() => onSelectLabel?.(label, getTypeOfLabel(label, availableFilters) || "")}
          onRemove={() => onRemoveLabel?.(label)}
        />
      ))}
    </div>
  );
}
