import { useContext, useState } from "react";

import { SearchFilter } from "@/components/molecules/searchFilter/SearchFilter";
import { FiltersLookupContext } from "@/context/FiltersLookupContext";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

const LABELS_OVERFLOWING_THRESHOLD = 10;
const MAX_LABELS = 4;

interface IProps {
  ancestorPath: TFilterPathLabel[];
  indented?: boolean;
  labels: TNestedSearchLabel[];
  level: number;
}

export const SearchFilters = ({ ancestorPath, indented, labels, level }: IProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { searchTerm } = useContext(FiltersLookupContext);

  const isOverflowing = searchTerm === "" && level === 3 && labels.length > LABELS_OVERFLOWING_THRESHOLD;
  const shownLabels = isExpanded || !isOverflowing ? labels : labels.slice(0, MAX_LABELS);

  const listClasses = joinTailwindClasses("flex flex-col gap-2 list-none", indented && "ml-8 mt-2 not-last:mb-2");

  return (
    <>
      <ul className={listClasses}>
        {shownLabels.map((label) => (
          <SearchFilter key={label.id} ancestorPath={ancestorPath} label={label} level={level} />
        ))}
      </ul>
      {isOverflowing && (
        <button type="button" className="mt-2 text-xs text-text-primary leading-5 underline" onClick={() => setIsExpanded((previous) => !previous)}>
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </>
  );
};
