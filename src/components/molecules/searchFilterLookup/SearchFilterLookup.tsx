import { LucideScanSearch } from "lucide-react";
import { useMemo, useState } from "react";

import { Input } from "@/components/atoms/input/Input";
import { SearchFilter } from "@/components/molecules/searchFilter/SearchFilter";
import { FiltersLookupContext } from "@/context/FiltersLookupContext";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { getFilterPathLabels, getLabelPathSignature } from "@/utils/filters/filterPaths";
import { toSearchableText } from "@/utils/text/toSearchableText";

const LABELS_OVERFLOWING_THRESHOLD = 8;
const MAX_LABELS = 4;
const MIN_SEARCH_LENGTH = 2;

interface IProps {
  ancestorPath: TFilterPathLabel[];
  defaultOpen?: boolean;
  labels: TNestedSearchLabel[];
  level: number;
}

// Gets a label path signature for each label or their children that partially includes the searchText
const getMatchingLabelPathSignatures = (labels: TNestedSearchLabel[], ancestorPath: TFilterPathLabel[], searchableSearchText: string): string[] => {
  return labels.flatMap((label) => {
    const isMatch = toSearchableText(label.value).includes(searchableSearchText) || toSearchableText(label.id).includes(searchableSearchText);
    const pathLabels = getFilterPathLabels(label, ancestorPath);
    return [
      ...(isMatch ? [getLabelPathSignature(pathLabels)] : []),
      ...getMatchingLabelPathSignatures(label.children, pathLabels, searchableSearchText),
    ];
  });
};

export const SearchFilterLookup = ({ ancestorPath, defaultOpen, labels, level }: IProps) => {
  const [searchText, setSearchText] = useState("");
  const [showAll, setShowAll] = useState(defaultOpen);

  const searchTerm = searchText.length >= MIN_SEARCH_LENGTH ? searchText : "";
  const matchingLabelPathSignatures = useMemo(
    () => (searchTerm !== "" ? getMatchingLabelPathSignatures(labels, ancestorPath, toSearchableText(searchTerm)) : []),
    [ancestorPath, labels, searchTerm]
  );

  // Show every option when a search is happening
  const isOverflowing = searchTerm === "" && labels.length > LABELS_OVERFLOWING_THRESHOLD;
  const clippedOptions = isOverflowing && !showAll ? labels.slice(0, MAX_LABELS) : labels;

  const hasNoMatches = searchTerm !== "" && matchingLabelPathSignatures.length === 0;
  const labelTaxonomy = labels.some((label) => ["geography", "country"].includes(label.type)) ? "geographies" : "filters";

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
      {!defaultOpen && isOverflowing && (
        <button
          type="button"
          className="self-start text-xs text-text-primary leading-5 underline"
          onClick={() => setShowAll((previous) => !previous)}
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
      {hasNoMatches && (
        <div className="p-4 flex flex-col items-center">
          <div className="p-3 bg-[#1A4F8C0D] rounded-full">
            <LucideScanSearch size={24} className="text-text-brand" />
          </div>
          <span className="mt-2 mb-1 text-sm text-text-primary font-medium leading-6">No matching {labelTaxonomy}</span>
          <p className="text-sm text-text-secondary font-normal leading-6">
            <button type="button" onClick={() => setSearchText("")} className="inline text-text-brand underline">
              Clear quick search
            </button>{" "}
            to continue
          </p>
        </div>
      )}
    </div>
  );
};
