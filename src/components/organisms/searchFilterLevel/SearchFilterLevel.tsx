import { ReactNode, useContext } from "react";

import { SearchFilterGroups } from "@/components/molecules/searchFilterGroups/SearchFilterGroups";
import { SearchFilterLookup } from "@/components/molecules/searchFilterLookup/SearchFilterLookup";
import { SearchFilterParent } from "@/components/molecules/searchFilterParent/SearchFilterParent";
import { SearchFilters } from "@/components/molecules/searchFilters/SearchFilters";
import { FiltersLookupContext } from "@/context/FiltersLookupContext";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { sortLabelsByValue } from "@/utils/filters/sortLabelsByValue";
import { getTypeCategory } from "@/utils/search/filterPathsToQueryGroup";
import { joinTailwindClasses } from "@/utils/tailwind";

const LOOKUP_THRESHOLD = 16;

const hasMultipleTypes = (labels: TNestedSearchLabel[]): boolean => {
  const labelTypes = new Set(labels.map((label) => getTypeCategory(label.type)));
  return labelTypes.size > 1;
};

const countLabelsAndDescendants = (labels: TNestedSearchLabel[]): number =>
  labels.reduce((count, label) => count + 1 + countLabelsAndDescendants(label.children), 0);

const descendantsWillRenderGroups = (labels: TNestedSearchLabel[]): boolean =>
  labels.some((label) => hasMultipleTypes(label.children) || descendantsWillRenderGroups(label.children));

interface IProps {
  ancestorPath: TFilterPathLabel[];
  emptyStateRender?: ReactNode;
  indented?: boolean;
  labels: TNestedSearchLabel[];
  level: number;
  renderParents?: boolean;
  topLevelDefaultOpen?: boolean;
}

// Render a set of label peers depending on content and composition
export const SearchFilterLevel = ({ ancestorPath, emptyStateRender, indented, labels, level, renderParents, topLevelDefaultOpen }: IProps) => {
  const { inUse: isLookupAtHigherLevel } = useContext(FiltersLookupContext);

  const indentedClasses = indented && "ml-8 mt-2 not-last:mb-2";

  // This shouldn't be possible without an empty state being provided
  if (level === 1 && labels.length === 0) {
    return emptyStateRender || null;
  }

  // Parents
  if (level === 1 && renderParents) {
    return (
      <ul className={joinTailwindClasses("flex flex-col gap-4 list-none", indentedClasses)}>
        {labels.map((label) => (
          <SearchFilterParent key={label.id} ancestorPath={ancestorPath} defaultOpen={topLevelDefaultOpen} label={label} level={level} />
        ))}
      </ul>
    );
  }

  const sortedLabels = sortLabelsByValue(labels);

  // Grouped by type
  if (hasMultipleTypes(labels)) {
    return <SearchFilterGroups ancestorPath={ancestorPath} indented={indented} labels={labels} level={level} />;
  }

  // Searchable checkboxes
  if (!isLookupAtHigherLevel && countLabelsAndDescendants(labels) > LOOKUP_THRESHOLD && !descendantsWillRenderGroups(labels)) {
    return (
      <div className={joinTailwindClasses(indentedClasses, "max-h-full overflow-y-auto")}>
        <SearchFilterLookup ancestorPath={ancestorPath} defaultOpen={level === 1 && topLevelDefaultOpen} labels={sortedLabels} level={level} />
      </div>
    );
  }

  // Checkboxes (default)
  return <SearchFilters ancestorPath={ancestorPath} indented={indented} labels={sortedLabels} level={level} />;
};
