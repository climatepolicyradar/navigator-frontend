import { Popover as BasePopover } from "@base-ui/react/popover";
import { ChevronRight, Circle, ListFilter } from "lucide-react";
import { useMemo } from "react";

import { IAggregationLabel } from "@/api/search";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { TLabelResult } from "@/hooks/useLabelSearch";
import { getAvailableLabelIdsFromAggregations, partitionByAvailability } from "@/utils/_experiment/labelAggregationAvailability";
import { labelTypeLabel } from "@/utils/_experiment/labelTypeLabel";
import { joinTailwindClasses } from "@/utils/tailwind";

import { TQueryGroup } from "../queryBuilder/QueryBuilder";

function hasValue(group: TQueryGroup | null | undefined, value: string): boolean {
  if (!group) return false;
  return group.filters.some((f) => ("value" in f ? f.value === value : hasValue(f, value)));
}

function hasActiveFilterOfType(filters: TLabelResult[], group: TQueryGroup | null | undefined, type: TLabelType): boolean {
  if (!group) return false;
  return group.filters.some((f) =>
    "value" in f ? filters.some((label) => label.value === f.value && label.type === type) : hasActiveFilterOfType(filters, f, type)
  );
}

const LABEL_TYPES = ["agent", "category", "entity_type", "geography", "concept", "activity_status", "status"] as const;
export type TLabelType = (typeof LABEL_TYPES)[number];

type TProps = {
  availableFilters: TLabelResult[];
  filters?: TQueryGroup | null;
  activeLabelType: TLabelType;
  onActiveLabelTypeChange: (labelType: TLabelType) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChange?: (checked: boolean, label: string) => void;
  /**
   * Labels aggregations from search results.
   * When present and there is an active query or filters, only labels whose
   * id appears here remain enabled - others are disabled/greyed.
   */
  aggregations?: IAggregationLabel[] | undefined;
  /**
   * Current text query, used so that clearing the search box also resets
   * any aggregation‑based disabling.
   */
  query?: string;
};

export function SearchFilters({
  availableFilters,
  filters,
  activeLabelType: activeLabelType,
  onActiveLabelTypeChange: onActiveLabelTypeChange,
  open,
  onOpenChange,
  onChange,
  aggregations,
  query,
}: TProps) {
  const availableLabelIds = useMemo(() => getAvailableLabelIdsFromAggregations(aggregations, query, filters), [aggregations, query, filters]);

  const sortedForLabelType = useMemo(
    () => availableFilters.filter((filter) => filter.type === activeLabelType).sort((a, b) => a.value.localeCompare(b.value)),
    [availableFilters, activeLabelType]
  );

  // Available (selectable) rows first - disabled aggregations at the bottom.
  const { enabledFilters, disabledFilters } = useMemo(() => {
    const { enabled, disabled } = partitionByAvailability(sortedForLabelType, availableLabelIds);
    return { enabledFilters: enabled, disabledFilters: disabled };
  }, [sortedForLabelType, availableLabelIds]);

  const renderCheckboxRow = (filter: TLabelResult, isAvailable: boolean) => {
    const checked = hasValue(filters, filter.value);
    return (
      <li key={filter.id}>
        <Checkbox
          label={filter.value}
          checked={checked}
          disabled={!isAvailable}
          onChange={(nextChecked) => {
            if (!isAvailable) return;
            onChange?.(nextChecked, filter.value);
          }}
        />
      </li>
    );
  };

  return (
    <BasePopover.Root open={open} onOpenChange={(value) => onOpenChange?.(value)}>
      <BasePopover.Trigger
        className={joinTailwindClasses(
          "inline-flex items-center gap-2 rounded-full border border-transparent-regular bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500",
          open ? "bg-inky-black! text-white!" : ""
        )}
      >
        <ListFilter className="text-neutral-400 h-4 w-4" />
        Filters
      </BasePopover.Trigger>

      <BasePopover.Portal>
        <BasePopover.Positioner positionMethod="fixed" sideOffset={8} side="bottom" align="start" className="z-50">
          <BasePopover.Popup className="w-150 rounded-xl border border-transparent-regular bg-white shadow-xl focus-visible:outline-none">
            <div className="">
              {!availableFilters.length && <p className="text-sm text-gray-500">No filter options found.</p>}
              {availableFilters.length > 0 && (
                <div className="flex gap-2">
                  <div className="basis-1/3 p-2 border-r border-transparent-regular">
                    <ul className="flex flex-col gap-2">
                      {LABEL_TYPES.map((agg) => (
                        <li key={agg} className="text-sm text-inky-black mb-1">
                          <button
                            className={joinTailwindClasses(
                              "relative rounded-sm w-full text-left px-6 py-2 text-sm text-inky-black font-medium hover:bg-neutral-200",
                              activeLabelType === agg ? "bg-neutral-200!" : ""
                            )}
                            onClick={() => onActiveLabelTypeChange(agg)}
                          >
                            {labelTypeLabel(agg)}
                            {activeLabelType === agg && (
                              <ChevronRight width={20} height={20} className="absolute right-2 top-1/2 transform -translate-y-1/2" />
                            )}
                            {hasActiveFilterOfType(availableFilters, filters, agg) && (
                              <Circle width={8} height={8} fill="currentColor" className="absolute left-2 top-1/2 transform -translate-y-1/2" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="max-h-[60vh] basis-2/3 p-4 overflow-y-auto text-sm flex flex-col">
                    <ul className="flex flex-col gap-2 text-inky-black">{enabledFilters.map((f) => renderCheckboxRow(f, true))}</ul>
                    {disabledFilters.length > 0 && enabledFilters.length > 0 ? <div className="h-6 w-full shrink-0" aria-hidden /> : null}
                    {disabledFilters.length > 0 ? (
                      <ul className="flex flex-col gap-2 text-inky-black">{disabledFilters.map((f) => renderCheckboxRow(f, false))}</ul>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
