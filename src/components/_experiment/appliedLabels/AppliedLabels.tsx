import { LucideX } from "lucide-react";

import { TLabelResult } from "@/hooks/useLabelSearch";

function getTypeOfLabel(label: string, availableFilters: TLabelResult[]): string | null {
  const found = availableFilters.find((f) => f.value === label);
  return found ? found.type : null;
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
      {query && (
        <span className="bg-gray-100 rounded inline-flex items-center gap-1 hover:bg-gray-200">
          <button className="py-2 pl-3" onClick={() => setQuery("")}>
            <span>Anything matching "{query}"</span>
          </button>
          <button className="rounded p-1.5 mr-1 hover:bg-gray-300" onClick={() => setQuery("")}>
            <LucideX width={14} height={14} />
          </button>
        </span>
      )}
      {labels.map((label, i) => (
        <span key={i} className="bg-gray-100 rounded inline-flex items-center gap-1 hover:bg-gray-200">
          <button className="py-2 pl-3" onClick={() => onSelectLabel?.(label, getTypeOfLabel(label, availableFilters) || "")}>
            <span key={i} className="">
              {label}
            </span>
          </button>
          <button className="rounded p-1.5 mr-1 hover:bg-gray-300" onClick={() => onRemoveLabel?.(label)}>
            <LucideX width={14} height={14} />
          </button>
        </span>
      ))}
    </div>
  );
}
