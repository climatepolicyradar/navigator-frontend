import { Popover as BasePopover } from "@base-ui/react/popover";
import { ChevronDown, ChevronRight, ChevronUp, Circle, ListFilter, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { IAggregationLabel } from "@/api/search";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { TLabelResult } from "@/hooks/useLabelSearch";
import { getAvailableLabelIdsFromAggregations, partitionByAvailability } from "@/utils/_experiment/labelAggregationAvailability";
import { labelTypeLabel } from "@/utils/_experiment/labelTypeLabel";
import { joinTailwindClasses } from "@/utils/tailwind";

import { TQueryGroup } from "../advancedFilters/AdvancedFilters";

function hasValue(group: TQueryGroup | null | undefined, value: string): boolean {
  if (!group) return false;
  return group.filters.some((f) => ("value" in f ? f.value === value : hasValue(f, value)));
}

function hasActiveFilterOfType(filters: TLabelResult[], group: TQueryGroup | null | undefined, type: TLabelType): boolean {
  if (!group) return false;
  return group.filters.some((f) =>
    "value" in f ? filters.some((label) => label.id === f.value && label.type === type) : hasActiveFilterOfType(filters, f, type)
  );
}

const PRIMARY_LABEL_TYPES = ["category", "published_date", "entity_type", "geography", "concept"] as const;
const OTHER_LABEL_TYPES = ["activity_status", "agent"] as const;
export type TLabelType = (typeof PRIMARY_LABEL_TYPES)[number] | (typeof OTHER_LABEL_TYPES)[number];

type TProps = {
  availableFilters: TLabelResult[];
  filters?: TQueryGroup | null;
  activeLabelType: TLabelType;
  onActiveLabelTypeChange: (labelType: TLabelType) => void;
  onAdvancedClick?: () => void;
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
  dateRangeValue?: string | null;
  onDateRangeChange?: (value: string | null) => void;
};

export function SearchFilters({
  availableFilters,
  filters,
  activeLabelType: activeLabelType,
  onActiveLabelTypeChange: onActiveLabelTypeChange,
  onAdvancedClick,
  open,
  onOpenChange,
  onChange,
  aggregations,
  query,
  dateRangeValue,
  onDateRangeChange,
}: TProps) {
  const [openOther, setOpenOther] = useState(false);
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
    const checked = hasValue(filters, filter.id);
    return (
      <li key={filter.id}>
        <Checkbox
          label={filter.value}
          checked={checked}
          disabled={!isAvailable}
          onChange={(nextChecked) => {
            if (!isAvailable) return;
            onChange?.(nextChecked, filter.id);
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
          <BasePopover.Popup className="w-160 rounded-xl border border-transparent-regular bg-white shadow-xl focus-visible:outline-none">
            <div className="">
              {!availableFilters.length && <p className="text-sm text-gray-500 p-2">No filter options found, please refresh the page.</p>}
              {availableFilters.length > 0 && (
                <div className="flex gap-2">
                  <div className="basis-60 shrink-0 p-2 border-r border-transparent-regular flex flex-col gap-2">
                    <ul className="flex flex-col border-b border-transparent-regular">
                      {PRIMARY_LABEL_TYPES.map((agg) => (
                        <li key={agg} className="text-sm text-inky-black mb-1">
                          <button
                            className={joinTailwindClasses(
                              "flex flex-nowrap items-center gap-2 rounded-sm w-full text-left p-2 pl-1 text-sm text-inky-black font-medium hover:bg-neutral-100",
                              activeLabelType === agg ? "bg-neutral-100!" : ""
                            )}
                            onClick={() => onActiveLabelTypeChange(agg)}
                          >
                            <span className="text-inky-blue px-2">
                              {hasActiveFilterOfType(availableFilters, filters, agg) ? (
                                <Circle width={8} height={8} fill="currentColor" />
                              ) : (
                                <span>&nbsp;&nbsp;</span>
                              )}
                            </span>
                            <span className="grow">{labelTypeLabel(agg)}</span>
                            {activeLabelType === agg && (
                              <span className=" text-neutral-500">
                                <ChevronRight width={20} height={20} />
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={joinTailwindClasses(
                        "flex flex-nowrap items-center gap-2 rounded-sm w-full text-left p-2 pl-1 text-sm text-neutral-500 font-medium hover:bg-neutral-100",
                        openOther ? "bg-neutral-100!" : ""
                      )}
                      onClick={() => setOpenOther((open) => !open)}
                    >
                      {openOther ? (
                        <>
                          <span className="px-1">
                            <ChevronUp className="text-neutral-500" width={16} height={16} />
                          </span>
                          <span className="grow">Less</span>
                        </>
                      ) : (
                        <>
                          <span className="px-1">
                            <ChevronDown className="text-neutral-500" width={16} height={16} />
                          </span>
                          <span className="grow">More</span>
                        </>
                      )}
                    </button>
                    {openOther && (
                      <ul>
                        {OTHER_LABEL_TYPES.map((agg) => (
                          <li key={agg} className="text-sm text-inky-black mb-1">
                            <button
                              className={joinTailwindClasses(
                                "flex flex-nowrap items-center gap-2 rounded-sm w-full text-left p-2 pl-1 text-sm text-inky-black font-medium hover:bg-neutral-100",
                                activeLabelType === agg ? "bg-neutral-100!" : ""
                              )}
                              onClick={() => onActiveLabelTypeChange(agg)}
                            >
                              <span className="text-inky-blue px-2">
                                {hasActiveFilterOfType(availableFilters, filters, agg) ? (
                                  <Circle width={8} height={8} fill="currentColor" />
                                ) : (
                                  <span>&nbsp;&nbsp;</span>
                                )}
                              </span>
                              <span className="grow">{labelTypeLabel(agg)}</span>
                              {activeLabelType === agg && (
                                <span className=" text-neutral-500">
                                  <ChevronRight width={20} height={20} />
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto pt-4">
                      <button
                        className="flex flex-nowrap items-center gap-2 rounded-sm w-full text-left p-2 pl-1 text-sm text-inky-black font-medium hover:bg-neutral-100"
                        onClick={onAdvancedClick}
                      >
                        <span className="px-1">
                          <SlidersHorizontal width={16} height={16} />
                        </span>
                        <span className="grow">Advanced filters</span>
                      </button>
                    </div>
                  </div>
                  <div className="max-h-[50vh] min-h-[50vh] grow p-4 overflow-y-auto text-sm flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="border-b border-transparent-regular pb-2">
                        <h4 className="text-sm text-inky-black font-medium">{labelTypeLabel(activeLabelType)}</h4>
                      </div>
                      {activeLabelType === "published_date" ? (
                        <div className="text-xs text-gray-600">
                          Date range is controlled in Advanced filters.
                          <button type="button" className="ml-2 text-blue-700 underline" onClick={() => onDateRangeChange?.(dateRangeValue ?? null)}>
                            Keep current range
                          </button>
                        </div>
                      ) : (
                        <>
                          {enabledFilters.length === 0 && <span>There are no available options</span>}
                          <ul className="flex flex-col gap-1 text-inky-black">{enabledFilters.map((f) => renderCheckboxRow(f, true))}</ul>
                        </>
                      )}
                    </div>
                    {disabledFilters.length > 0 && <div className="h-0 w-full shrink-0 border-b border-transparent-regular" aria-hidden />}
                    {disabledFilters.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <div className="">
                          <h4 className="text-sm text-inky-black font-medium">Not relevant to applied filters</h4>
                        </div>
                        <ul className="flex flex-col gap-1 text-inky-black">{disabledFilters.map((f) => renderCheckboxRow(f, false))}</ul>
                      </div>
                    )}
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
