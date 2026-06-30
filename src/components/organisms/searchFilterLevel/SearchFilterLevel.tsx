import sortBy from "lodash/sortBy";
import { useMemo } from "react";

import { SearchFilter } from "@/components/molecules/searchFilter/SearchFilter";
import { SearchFilterGroups } from "@/components/molecules/searchFilterGroups/SearchFilterGroups";
import { SearchFilterLookup } from "@/components/molecules/searchFilterLookup/SearchFilterLookup";
import { SearchFilterParent } from "@/components/molecules/searchFilterParent/SearchFilterParent";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { joinTailwindClasses } from "@/utils/tailwind";

const LOOKUP_THRESHOLD = 8;

interface IProps {
  ancestorPath: TFilterPathLabel[];
  indented?: boolean;
  labels: TNestedSearchLabel[];
}

// Render a set of label peers depending on content and composition
export const SearchFilterLevel = ({ ancestorPath, indented, labels }: IProps) => {
  const isLongShallowList = useMemo(() => labels.length > LOOKUP_THRESHOLD && labels.every((label) => label.children.length === 0), [labels]);
  const sortedLabels = useMemo(() => sortBy(labels, "id"), [labels]);

  const indentedClasses = indented && "ml-8 mt-2 not-last:mb-2";

  // Categories
  const labelsAreCategories = ancestorPath.length === 0 && labels.every((label) => label.type === "category");
  if (labelsAreCategories) {
    return (
      <ul className={joinTailwindClasses("list-none", indentedClasses)}>
        {sortedLabels.map((label) => (
          <SearchFilterParent key={label.id} ancestorPath={ancestorPath} label={label} />
        ))}
      </ul>
    );
  }

  // Grouped by type
  const labelTypes = new Set(labels.map((label) => label.type));
  if (labelTypes.size > 1) {
    return <SearchFilterGroups ancestorPath={ancestorPath} labels={labels} />;
  }

  // Searchable checkboxes
  if (isLongShallowList) {
    return (
      <li className={indentedClasses}>
        <SearchFilterLookup ancestorPath={ancestorPath} labels={sortedLabels} />
      </li>
    );
  }

  // Checkboxes (default)
  return (
    <ul className={joinTailwindClasses("flex flex-col gap-2 list-none", indentedClasses)}>
      {sortedLabels.map((label) => (
        <SearchFilter key={label.id} ancestorPath={ancestorPath} label={label} />
      ))}
    </ul>
  );
};
