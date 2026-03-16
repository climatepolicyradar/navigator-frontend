import { Popover as BasePopover } from "@base-ui/react/popover";
import { ListFilter } from "lucide-react";
import { useEffect, useState } from "react";

import { Checkbox } from "@/components/checkbox/Checkbox";
import { TLabelResult, loadLabels } from "@/hooks/useLabelSearch";

import { TQueryGroup } from "../queryBuilder/QueryBuilder";

type TProps = {
  filters?: TQueryGroup | null;
  onChange?: (checked: boolean, label: string) => void;
};

export function SearchFilters({ filters, onChange }: TProps) {
  const [availableFilters, setAvailableFilters] = useState<TLabelResult[]>([]);

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
            <div className="max-h-[60vh] overflow-y-auto p-4">
              {!availableFilters.length && <p className="text-sm text-gray-500">No filter options found.</p>}
              {availableFilters.length > 0 && (
                <ul>
                  {availableFilters.map((filter) => {
                    const isChecked = filters?.filters.some((f) => "value" in f && f.value === filter.value);

                    return (
                      <li key={filter.id}>
                        <Checkbox label={filter.value} checked={isChecked} onChange={(checked) => onChange?.(checked, filter.value)} />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
