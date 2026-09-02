import sortBy from "lodash/sortBy";
import { LucideScanSearch } from "lucide-react";
import { useContext, useMemo } from "react";

import { SearchFilterGroups } from "@/components/molecules/searchFilterGroups/SearchFilterGroups";
import { SearchFilterLookup } from "@/components/molecules/searchFilterLookup/SearchFilterLookup";
import { SearchFilterParent } from "@/components/molecules/searchFilterParent/SearchFilterParent";
import { SearchFilters } from "@/components/molecules/searchFilters/SearchFilters";
import { FiltersLookupContext } from "@/context/FiltersLookupContext";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

const LOOKUP_THRESHOLD = 16;

const countLabelsAndDescendants = (labels: TNestedSearchLabel[]): number =>
  labels.reduce((count, label) => count + 1 + countLabelsAndDescendants(label.children), 0);

interface IProps {
  ancestorPath: TFilterPathLabel[];
  indented?: boolean;
  labels: TNestedSearchLabel[];
  level: number;
  renderParents?: boolean;
  parentsDefaultOpen?: boolean;
  filtersPlural?: string;
}

// Render a set of label peers depending on content and composition
export const SearchFilterLevel = ({ ancestorPath, indented, labels, level, parentsDefaultOpen, renderParents, filtersPlural }: IProps) => {
  const { inUse: isLookupAtHigherLevel } = useContext(FiltersLookupContext);

  const levelIsGroups = labels.every((label) => label.type === "group");
  const sortedLabels = useMemo(() => (levelIsGroups ? labels : sortBy(labels, "value")), [labels, levelIsGroups]);

  const indentedClasses = indented && "ml-8 mt-2 not-last:mb-2";
  const labelTypes = new Set(labels.map((label) => label.type));

  // Empty state
  if (labels.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center">
        <div className="p-3 bg-[#1A4F8C0D] rounded-full">
          <LucideScanSearch size={24} className="text-text-brand" />
        </div>
        <span className="mt-2 mb-1 text-sm text-text-primary font-medium leading-6">No {filtersPlural || "filters"}</span>
        <p className="text-sm text-text-secondary font-normal leading-6 text-center">
          There are no {filtersPlural || "filters"} assigned to this document or group of documents
          <button
            type="button"
            onClick={() => {
              //TODO
            }}
            className="inline text-text-brand underline"
          >
            Learn more about {filtersPlural || "filters"}
          </button>
        </p>
      </div>
    );
  }

  // Parents
  if (level === 1 && renderParents) {
    return (
      <ul className={joinTailwindClasses("flex flex-col gap-4 list-none", indentedClasses)}>
        {sortedLabels.map((label) => (
          <SearchFilterParent key={label.id} ancestorPath={ancestorPath} defaultOpen={parentsDefaultOpen} label={label} level={level} />
        ))}
      </ul>
    );
  }

  // Grouped by type
  if (labelTypes.size > 1) {
    return <SearchFilterGroups ancestorPath={ancestorPath} labels={labels} level={level} />;
  }

  // Searchable checkboxes
  if (countLabelsAndDescendants(labels) > LOOKUP_THRESHOLD && !isLookupAtHigherLevel) {
    return (
      <div className={joinTailwindClasses(indentedClasses, "max-h-full overflow-y-auto")}>
        <SearchFilterLookup ancestorPath={ancestorPath} labels={sortedLabels} level={level} />
      </div>
    );
  }

  // Checkboxes (default)
  return <SearchFilters ancestorPath={ancestorPath} indented={indented} labels={sortedLabels} level={level} />;
};
