import { Popover as BasePopover } from "@base-ui/react/popover";
import { ChevronRight, Circle, ListFilter } from "lucide-react";
import { useMemo } from "react";

import { Checkbox } from "@/components/checkbox/Checkbox";
import { TLabelResult } from "@/hooks/useLabelSearch";
import { labelTypeLabel } from "@/utils/_experiment/labelTypeLabel";
import { joinTailwindClasses } from "@/utils/tailwind";

import { TQueryGroup } from "../queryBuilder/QueryBuilder";
import { IAggregationLabel } from "../searchResults/SearchResults";

function hasValue(group: TQueryGroup | null | undefined, value: string): boolean {
  if (!group) return false;
  return group.filters.some((f) => ("value" in f ? f.value === value : hasValue(f, value)));
}

function hasActiveFilterOfType(filters: TLabelResult[], group: TQueryGroup | null | undefined, type: TFilterCategory): boolean {
  if (!group) return false;
  return group.filters.some((f) =>
    "value" in f ? filters.some((label) => label.value === f.value && label.type === type) : hasActiveFilterOfType(filters, f, type)
  );
}

function isFilterGroupEmpty(group: TQueryGroup | null | undefined): boolean {
  if (!group || !group.filters || group.filters.length === 0) return true;

  for (const f of group.filters) {
    if ("value" in f) {
      return false;
    }
    if (!isFilterGroupEmpty(f)) {
      return false;
    }
  }

  return true;
}

export type TFilterCategory = "concept" | "entity_type" | "geography" | "agent" | "activity_status" | "status";

const FILTER_AGGREGATIONS: TFilterCategory[] = ["agent", "entity_type", "geography", "concept", "activity_status", "status"];

type TProps = {
  availableFilters: TLabelResult[];
  filters?: TQueryGroup | null;
  activeCategory: TFilterCategory;
  onActiveCategoryChange: (category: TFilterCategory) => void;
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
  activeCategory,
  onActiveCategoryChange,
  open,
  onOpenChange,
  onChange,
  aggregations,
  query,
}: TProps) {
  const hasAnyFilters = !isFilterGroupEmpty(filters);
  const hasQuery = !!(query && query.trim().length > 0);

  /**
   * We only want aggregations to disable the UI filters when the user
   * has actually "committed" to a search context – i.e. there is
   * a non‑empty query or some active filters.
   *
   * If both query and filters are empty, we treat everything as enabled
   * regardless of whatever last aggregations we might have cached.
   */
  const shouldConstrain = hasQuery || hasAnyFilters;

  /**
   * Build a set of label IDs that have hits in the current search.
   * If we decide not to disable (no query and no filters) or if
   * there are no aggregations, this is undefined, which we treat
   * as "don't disable anything".
   */
  const availableLabelIds = useMemo(() => {
    if (!shouldConstrain || !aggregations || aggregations.length === 0) {
      return undefined;
    }

    const ids: string[] = [];
    for (const agg of aggregations) {
      if (agg && agg.value && typeof agg.value.id === "string") {
        ids.push(agg.value.id);
      }
    }

    if (ids.length === 0) {
      return undefined;
    }

    return new Set(ids);
  }, [aggregations, shouldConstrain]);

  const sortedForCategory = useMemo(
    () => availableFilters.filter((filter) => filter.type === activeCategory).sort((a, b) => a.value.localeCompare(b.value)),
    [availableFilters, activeCategory]
  );

  // Available (selectable) rows first - disabled aggregations at the bottom.
  const { enabledFilters, disabledFilters } = useMemo(() => {
    if (!availableLabelIds) {
      return { enabledFilters: sortedForCategory, disabledFilters: [] as TLabelResult[] };
    }
    const enabled: TLabelResult[] = [];
    const disabled: TLabelResult[] = [];
    for (const row of sortedForCategory) {
      if (availableLabelIds.has(row.id)) {
        enabled.push(row);
      } else {
        disabled.push(row);
      }
    }
    return { enabledFilters: enabled, disabledFilters: disabled };
  }, [sortedForCategory, availableLabelIds]);

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
                      {FILTER_AGGREGATIONS.map((agg) => (
                        <li key={agg} className="text-sm text-inky-black mb-1">
                          <button
                            className={joinTailwindClasses(
                              "relative rounded-sm w-full text-left px-6 py-2 text-sm text-inky-black font-medium hover:bg-neutral-200",
                              activeCategory === agg ? "bg-neutral-200!" : ""
                            )}
                            onClick={() => onActiveCategoryChange(agg)}
                          >
                            {labelTypeLabel(agg)}
                            {activeCategory === agg && (
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
