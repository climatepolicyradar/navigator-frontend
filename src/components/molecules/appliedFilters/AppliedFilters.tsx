import { LucideX } from "lucide-react";
import { useContext, useMemo } from "react";

import { FiltersContext } from "@/context/FiltersContext";
import { sortFilterPathLabels } from "@/utils/filters/filterPaths";

export const AppliedFilters = () => {
  const { checkedLabelPaths, clearFilters, toggleFilter } = useContext(FiltersContext);

  const labels = useMemo(() => sortFilterPathLabels(checkedLabelPaths), [checkedLabelPaths]);

  if (labels.length === 0) return null;

  return (
    <ul
      className="col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2 flex flex-wrap items-center gap-2 list-none"
      aria-label="Applied filters"
    >
      {labels.map((labelPath) => {
        const label = labelPath[0];

        return (
          <li key={label.id} className="flex flex-nowrap gap-1 pl-3 pr-2 py-1 bg-bg-flat rounded-full">
            <span className="block text-sm text-text-primary text-nowrap font-medium leading-5">{label.value}</span>
            <button
              type="button"
              className="p-1 -m-1 text-inky-blue"
              aria-label={`Remove ${label.value}`}
              onClick={() => toggleFilter(labelPath, false)}
            >
              <LucideX size={16} aria-hidden={true} />
            </button>
          </li>
        );
      })}
      <li>
        <button
          type="button"
          className="px-3 py-1 text-sm text-text-primary font-normal leading-5"
          aria-label="Clear all filters"
          onClick={() => clearFilters()}
        >
          Clear all
        </button>
      </li>
    </ul>
  );
};
