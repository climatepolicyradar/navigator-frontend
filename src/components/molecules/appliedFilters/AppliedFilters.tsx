import { LucideX } from "lucide-react";
import { useContext, useMemo } from "react";

import { ARROW_RIGHT } from "@/constants/chars";
import { COUNTRY_FLAGS } from "@/constants/flags";
import { FiltersContext } from "@/context/FiltersContext";
import { TFilterPathLabel } from "@/types";
import { getLabelPathSignature, sortFilterPathLabels } from "@/utils/filters/filterPaths";
import { joinTailwindClasses } from "@/utils/tailwind";

const getAppliedFilterLabel = (labelValues: Record<string, string>, labelPath: TFilterPathLabel[]): string => {
  const getLabelValue = (label: TFilterPathLabel) => labelValues[label.id] || label.value;
  const isGeography = labelPath.some((label) => ["country", "geography"].includes(label.type));

  // Geographies are arrow separated paths with country emojis
  if (isGeography) {
    return [...labelPath]
      .reverse()
      .map((label) => {
        const emoji = COUNTRY_FLAGS[label.value] ?? "";
        const emojiString = emoji ? `${emoji} ` : "";
        return `${emojiString}${getLabelValue(label)}`;
      })
      .join(` ${ARROW_RIGHT} `);
  }

  return getLabelValue(labelPath[0]);
};

interface IProps {
  ancestorPath?: TFilterPathLabel[];
  className?: string;
  showClearAll?: boolean;
}

export const AppliedFilters = ({ ancestorPath = [], className, showClearAll }: IProps) => {
  const { checkedLabelPaths, clearFilters, labelValues, toggleFilter } = useContext(FiltersContext);

  const labels = useMemo(() => {
    const ancestorSignature = getLabelPathSignature(ancestorPath);
    const descendantLabelPaths = checkedLabelPaths.filter(
      (labelPath) => labelPath.length > ancestorPath.length && getLabelPathSignature(labelPath).startsWith(ancestorSignature)
    );

    return sortFilterPathLabels(descendantLabelPaths);
  }, [checkedLabelPaths, ancestorPath]);

  if (labels.length === 0) return null;

  const allClasses = joinTailwindClasses(
    "col-start-1 -col-end-1 cols-5:col-start-2 cols-5:-col-end-2 flex flex-wrap items-center gap-2 list-none",
    className
  );

  return (
    <ul className={allClasses} aria-label="Applied filters">
      {labels.map((labelPath) => {
        const label = labelPath[0];

        return (
          <li key={label.id} className="flex flex-nowrap gap-1 pl-3 pr-2 py-1 bg-[#1A4F8C1A] rounded-full">
            <span className="block text-sm text-text-primary text-nowrap font-medium leading-5">{getAppliedFilterLabel(labelValues, labelPath)}</span>
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
      {showClearAll && (
        <li>
          <button
            type="button"
            className="px-3 py-1 text-sm text-text-primary font-normal leading-5"
            aria-label="Clear all filters"
            onClick={() => clearFilters()}
          >
            Reset
          </button>
        </li>
      )}
    </ul>
  );
};
