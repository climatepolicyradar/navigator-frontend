import sortBy from "lodash/sortBy";
import { LucideX } from "lucide-react";
import { useContext, useMemo } from "react";

import { FiltersContext } from "@/context/FiltersContext";
import { getLabelPathSignature } from "@/utils/filters/filterPaths";

export const AppliedFilters = () => {
  const { checkedLabelPaths, resetFilters, toggleFilter } = useContext(FiltersContext);

  const labels = useMemo(
    () =>
      sortBy(
        checkedLabelPaths.map((labelPath) => ({ label: labelPath[0], labelPath, sortSignature: getLabelPathSignature([...labelPath].reverse()) })),
        "sortSignature" // sort by the order that filters appear in the list
      ),
    [checkedLabelPaths]
  );

  if (labels.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2 list-none" aria-label="Applied filters">
      {labels.map(({ label, labelPath }) => (
        <li key={label.id} className="flex flex-nowrap gap-1 pl-3 pr-2 py-1 bg-[#0050911a] rounded-full">
          <span className="text-sm text-text-primary font-medium leading-5">{label.value}</span>
          <button
            type="button"
            className="p-1 -m-1 text-inky-blue"
            aria-label={`Remove ${label.value}`}
            onClick={() => toggleFilter(labelPath, false)}
          >
            <LucideX size={16} aria-hidden={true} />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          className="px-3 py-1 text-sm text-text-primary font-normal leading-5"
          aria-label="Clear all filters"
          onClick={() => resetFilters()}
        >
          Clear all
        </button>
      </li>
    </ul>
  );
};
