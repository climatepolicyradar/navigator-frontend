import { useMemo, useState } from "react";

import { Input } from "@/components/atoms/input/Input";
import { SearchFilter } from "@/components/molecules/searchFilter/SearchFilter";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";

const MAX_OPTIONS = 8;

interface IProps {
  ancestorPath: TFilterPathLabel[];
  labels: TNestedSearchLabel[];
}

export const SearchFilterLookup = ({ ancestorPath, labels }: IProps) => {
  const [searchText, setSearchText] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredOptions = useMemo(
    () => (searchText ? labels.filter((option) => option.value.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) : labels),
    [labels, searchText]
  );
  const isOverflowing = filteredOptions.length > MAX_OPTIONS;
  const clippedOptions = showAll ? filteredOptions : filteredOptions.slice(0, MAX_OPTIONS);

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
        {clippedOptions.map((option) => {
          const pathLabels = [getFilterPathLabel(option), ...ancestorPath];

          return <SearchFilter key={option.id} ancestorPath={pathLabels} label={option} />;
        })}
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
