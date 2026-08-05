import { useMemo, useState } from "react";

import { Input } from "@/components/atoms/input/Input";
import { SearchFilter } from "@/components/molecules/searchFilter/SearchFilter";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";

const LABELS_OVERFLOWING_THRESHOLD = 8;
const MAX_LABELS = 4;

interface IProps {
  ancestorPath: TFilterPathLabel[];
  labels: TNestedSearchLabel[];
  level: number;
}

export const SearchFilterLookup = ({ ancestorPath, labels, level }: IProps) => {
  const [searchText, setSearchText] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredOptions = useMemo(
    () => (searchText ? labels.filter((option) => option.value.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) : labels),
    [labels, searchText]
  );
  const isOverflowing = filteredOptions.length > LABELS_OVERFLOWING_THRESHOLD;
  const clippedOptions = showAll ? filteredOptions : filteredOptions.slice(0, MAX_LABELS);

  return (
    <div className="w-full flex flex-col gap-2">
      <Input
        clearable
        placeholder="Quick search..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        onClear={() => setSearchText("")}
      />
      <ul className="flex flex-col gap-2 list-none">
        {clippedOptions.map((option) => (
          <SearchFilter key={option.id} ancestorPath={ancestorPath} label={option} level={level} />
        ))}
      </ul>
      {isOverflowing && (
        <button
          type="button"
          className="self-start text-xs text-text-primary leading-5 underline"
          onClick={() => setShowAll((previous) => !previous)}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};
