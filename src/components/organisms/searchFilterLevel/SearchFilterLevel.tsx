import sortBy from "lodash/sortBy";
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
  topLevelDefaultOpen?: boolean;
}

// Render a set of label peers depending on content and composition
export const SearchFilterLevel = ({ ancestorPath, indented, labels, level, renderParents, topLevelDefaultOpen }: IProps) => {
  const { inUse: isLookupAtHigherLevel } = useContext(FiltersLookupContext);

  const levelIsGroups = labels.every((label) => label.type === "group");
  const sortedLabels = useMemo(() => (levelIsGroups ? labels : sortBy(labels, "value")), [labels, levelIsGroups]);

  const indentedClasses = indented && "ml-8 mt-2 not-last:mb-2";
  const labelTypes = new Set(labels.map((label) => label.type));

  // Parents
  if (level === 1 && renderParents) {
    return (
      <ul className={joinTailwindClasses("flex flex-col gap-4 list-none", indentedClasses)}>
        {sortedLabels.map((label) => (
          <SearchFilterParent key={label.id} ancestorPath={ancestorPath} defaultOpen={topLevelDefaultOpen} label={label} level={level} />
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
        <SearchFilterLookup ancestorPath={ancestorPath} defaultOpen={level === 1 && topLevelDefaultOpen} labels={sortedLabels} level={level} />
      </div>
    );
  }

  // Checkboxes (default)
  return <SearchFilters ancestorPath={ancestorPath} indented={indented} labels={sortedLabels} level={level} />;
};
