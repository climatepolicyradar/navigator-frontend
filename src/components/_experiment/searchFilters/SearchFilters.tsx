import { Popover as BasePopover } from "@base-ui/react/popover";
import { ChevronRight, Circle, ListFilter } from "lucide-react";
import { useEffect, useState } from "react";

import { Checkbox } from "@/components/checkbox/Checkbox";
import { TLabelResult, loadLabels } from "@/hooks/useLabelSearch";

import { TQueryGroup } from "../queryBuilder/QueryBuilder";

function hasValue(group: TQueryGroup | null | undefined, value: string): boolean {
  if (!group) return false;
  return group.filters.some((f) => ("value" in f ? f.value === value : hasValue(f, value)));
}

function hasActiveFilterOfType(filters: TLabelResult[], group: TQueryGroup | null | undefined, type: TFILTER_AGGREGATIONS): boolean {
  if (!group) return false;
  return group.filters.some((f) =>
    "value" in f ? filters.some((label) => label.value === f.value && label.type === type) : hasActiveFilterOfType(filters, f, type)
  );
}

type TFILTER_AGGREGATIONS = "concept" | "entity_type" | "geography" | "agent" | "activity_status" | "status";
const FILTER_AGGREGATIONS: TFILTER_AGGREGATIONS[] = ["concept", "entity_type", "geography", "agent", "activity_status", "status"];

type TProps = {
  filters?: TQueryGroup | null;
  openFilter?: TFILTER_AGGREGATIONS;
  onChange?: (checked: boolean, label: string) => void;
};

export function SearchFilters({ filters, openFilter, onChange }: TProps) {
  const [availableFilters, setAvailableFilters] = useState<TLabelResult[]>([]);
  const [activeFilter, setActiveFilter] = useState<TFILTER_AGGREGATIONS>(openFilter || "concept");

  useEffect(() => {
    // Load some initial filter options on mount (e.g. top labels)
    loadLabels("").then(setAvailableFilters);
  }, []);

  return (
    <BasePopover.Root>
      <BasePopover.Trigger className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500">
        <ListFilter className="h-4 w-4" />
        Filters
      </BasePopover.Trigger>

      <BasePopover.Portal>
        <BasePopover.Positioner positionMethod="fixed" sideOffset={8} side="bottom" align="start" className="z-50">
          <BasePopover.Popup className="w-130 rounded-xl border border-gray-200 bg-white shadow-2xl focus-visible:outline-none">
            <div className="">
              {!availableFilters.length && <p className="text-sm text-gray-500">No filter options found.</p>}
              {availableFilters.length > 0 && (
                <div className="flex gap-2">
                  <div className="basis-1/3 pt-2 border-r border-gray-300">
                    <ul className="flex flex-col gap-2">
                      {FILTER_AGGREGATIONS.map((agg) => (
                        <li key={agg} className="text-sm text-gray-700 mb-1">
                          <button
                            className={`relative w-full text-left px-6 py-1 text-sm text-gray-700 hover:bg-gray-300 ${activeFilter === agg ? "bg-brand! text-white!" : ""}`}
                            onClick={() => setActiveFilter(agg)}
                          >
                            {agg.slice(0, 1).toUpperCase() + agg.replace("_", " ").slice(1)}
                            {activeFilter === agg && (
                              <ChevronRight width={20} height={20} className="absolute right-2 top-1/2 transform -translate-y-1/2"></ChevronRight>
                            )}
                            {hasActiveFilterOfType(availableFilters, filters, agg) && (
                              <Circle width={8} height={8} fill="currentColor" className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ul className="flex flex-col gap-1 max-h-[60vh] basis-2/3 p-4 overflow-y-auto text-sm">
                    {availableFilters
                      .filter((filter) => filter.type === activeFilter)
                      .map((filter) => {
                        const isChecked = hasValue(filters, filter.value);

                        return (
                          <li key={filter.id}>
                            <Checkbox label={filter.value} checked={isChecked} onChange={(checked) => onChange?.(checked, filter.value)} />
                          </li>
                        );
                      })}
                  </ul>
                </div>
              )}
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
