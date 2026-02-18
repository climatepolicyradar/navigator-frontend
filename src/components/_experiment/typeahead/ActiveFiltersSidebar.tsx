import { Button } from "@base-ui/react/button";

import { SHADOW_SEARCH_FILTER_DIMENSIONS, TFilterKey } from "@/utils/_experiment/shadowSearchFilterConfig";
import { SelectedFilters } from "@/utils/_experiment/suggestedFilterUtils";

export interface ActiveFiltersSidebarProps {
  /** Current selected filters (included + excluded). */
  filters: SelectedFilters;
  /** Called when user removes a single filter value. */
  onRemove: (key: TFilterKey, value: string) => void;
  /** Called when user clears all filters. */
  onClearAll: () => void;
  /** Whether any filter has values (shows "Clear all" when true). */
  hasAnyFilters: boolean;
}

const chipBase = "group inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-medium transition";
const chipIncluded = "border border-border-lighter bg-surface-light text-text-primary hover:bg-surface-ui hover:text-text-brand";
const chipExcluded = "border border-dashed border-border-lighter bg-surface-light/70 text-text-secondary hover:bg-surface-ui hover:text-text-brand";

/**
 * Renders the active filters sidebar: one section per dimension (topics, geos, years, document types),
 * then an "Excluded" section if any excluded filters are set. Driven by SHADOW_SEARCH_FILTER_DIMENSIONS.
 */
export function ActiveFiltersSidebar({ filters, onRemove, onClearAll, hasAnyFilters }: ActiveFiltersSidebarProps) {
  return (
    <aside className="md:col-span-4 space-y-4 border border-border-lighter bg-white p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">Active filters</p>
      </div>

      <div className="space-y-3">
        {SHADOW_SEARCH_FILTER_DIMENSIONS.included.map(({ key, label }) => {
          const values = filters[key];
          return (
            <div key={key}>
              <p className="mb-1 text-xs font-medium text-text-tertiary">{label}</p>
              <div className="flex flex-wrap gap-2">
                {values.length === 0 && <span className="text-xs text-text-tertiary">None</span>}
                {values.map((value: string) => (
                  <Button key={value} onClick={() => onRemove(key, value)} className={`${chipBase} ${chipIncluded}`}>
                    <span>{value}</span>
                    <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        })}

        {SHADOW_SEARCH_FILTER_DIMENSIONS.excluded.some(({ key }) => filters[key].length > 0) && (
          <div className="border-t border-border-lighter pt-3 mt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-tertiary">Excluded</p>
            <div className="space-y-2">
              {SHADOW_SEARCH_FILTER_DIMENSIONS.excluded.map(({ key, label }) => {
                const values = filters[key];
                if (values.length === 0) return null;
                return (
                  <div key={key}>
                    <p className="mb-1 text-[10px] font-medium text-text-tertiary">{label}</p>
                    <div className="flex flex-wrap gap-2">
                      {values.map((value: string) => (
                        <Button key={value} onClick={() => onRemove(key, value)} className={`${chipBase} ${chipExcluded}`}>
                          <span>{value}</span>
                          <span className="text-xs text-text-tertiary group-hover:text-text-brand">×</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {hasAnyFilters && (
        <Button
          onClick={onClearAll}
          className="mt-2 inline-flex items-center border border-border-lighter bg-surface-light px-3 py-2 text-xs font-medium text-text-secondary hover:bg-surface-ui"
        >
          Clear all filters
        </Button>
      )}
    </aside>
  );
}
