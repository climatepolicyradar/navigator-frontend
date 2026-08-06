import { useMemo, useState } from "react";

import { Input } from "@/components/atoms/input/Input";
import { SearchFilter } from "@/components/molecules/searchFilter/SearchFilter";
import { FiltersLookupContext } from "@/context/FiltersLookupContext";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { getFilterPathLabel, getLabelPathSignature } from "@/utils/filters/filterPaths";

const LABELS_OVERFLOWING_THRESHOLD = 8;
const MAX_LABELS = 4;
const MIN_SEARCH_LENGTH = 2;

interface IProps {
  ancestorPath: TFilterPathLabel[];
  labels: TNestedSearchLabel[];
  level: number;
}

// Gets a label path signature for each label or their children that partially includes the searchText
const getMatchingLabelPathSignatures = (labels: TNestedSearchLabel[], ancestorPath: TFilterPathLabel[], searchText: string): string[] => {
  const lowerSearchText = searchText.toLocaleLowerCase();

  return labels.flatMap((label) => {
    const isMatch = label.value.toLocaleLowerCase().includes(lowerSearchText) || label.id.toLocaleLowerCase().includes(lowerSearchText);
    const pathLabels = [getFilterPathLabel(label), ...ancestorPath];
    return [...(isMatch ? [getLabelPathSignature(pathLabels)] : []), ...getMatchingLabelPathSignatures(label.children, pathLabels, searchText)];
  });
};

export const SearchFilterLookup = ({ ancestorPath, labels, level }: IProps) => {
  const [searchText, setSearchText] = useState("");
  const [showAll, setShowAll] = useState(false);

  const searchTerm = searchText.length >= MIN_SEARCH_LENGTH ? searchText : "";
  const matchingLabelPathSignatures = useMemo(
    () => (searchTerm !== "" ? getMatchingLabelPathSignatures(labels, ancestorPath, searchTerm.toLocaleLowerCase()) : []),
    [ancestorPath, labels, searchTerm]
  );

  // Show every option when a search is happening
  const isOverflowing = searchTerm === "" && labels.length > LABELS_OVERFLOWING_THRESHOLD;
  const clippedOptions = isOverflowing && !showAll ? labels.slice(0, MAX_LABELS) : labels;

  return (
    <div className="w-full flex flex-col gap-2">
      <Input
        clearable
        placeholder="Quick search..."
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        onClear={() => setSearchText("")}
      />
      <FiltersLookupContext.Provider value={{ inUse: true, searchTerm, matchingLabelPathSignatures }}>
        <ul className="flex flex-col gap-2 list-none">
          {clippedOptions.map((option) => (
            <SearchFilter key={option.id} ancestorPath={ancestorPath} label={option} level={level} />
          ))}
        </ul>
      </FiltersLookupContext.Provider>
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
