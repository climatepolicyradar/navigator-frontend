import { useMemo, useState } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { Input } from "@/components/atoms/input/Input";
import { TNestedSearchLabel } from "@/types";

const MAX_OPTIONS = 8;

interface IProps {
  options: TNestedSearchLabel[];
}

// TODO on check filter, default checked state
export const FilterSearch = ({ options }: IProps) => {
  const [searchText, setSearchText] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredOptions = useMemo(
    () => (searchText ? options.filter((option) => option.value.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())) : options),
    [options, searchText]
  );
  const isOverflowing = filteredOptions.length > MAX_OPTIONS;
  const clippedOptions = showAll ? filteredOptions : filteredOptions.slice(0, MAX_OPTIONS);

  return (
    <div className="w-full flex flex-col gap-2">
      <Input placeholder="Quick search..." value={searchText} onChange={(event) => setSearchText(event.target.value)} size="small" />
      {clippedOptions.map((option) => (
        <Checkbox key={option.id} label={option.value} onCheckedChange={() => {}} />
      ))}
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
