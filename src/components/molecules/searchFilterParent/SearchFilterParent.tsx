import { ChevronDown } from "lucide-react";
import { MouseEvent, useContext, useState } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { AppliedFilters } from "@/components/molecules/appliedFilters/AppliedFilters";
import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { FiltersContext } from "@/context/FiltersContext";
import { TCheckboxState, TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { filterHasSelectedChildren } from "@/utils/filters/filterHasSelectedChildren";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";
import { getFilterStatus } from "@/utils/filters/getFilterStatus";
import { joinTailwindClasses } from "@/utils/tailwind";
import { firstCase } from "@/utils/text";

interface IProps {
  ancestorPath: TFilterPathLabel[];
  label: TNestedSearchLabel;
  level: number;
  showAppliedFilters?: boolean;
}

export const SearchFilterParent = ({ ancestorPath, label, level, showAppliedFilters }: IProps) => {
  const { checkedLabelPaths, toggleFilter } = useContext(FiltersContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const pathLabels = [getFilterPathLabel(label), ...ancestorPath];
  const checked = getFilterStatus(pathLabels, checkedLabelPaths);

  const hasChildren = label.children.length > 0;

  const onCheckedChange = (value: TCheckboxState) => {
    if (value === true) setIsExpanded(true);
    if (value === false) {
      const hasCheckedChildren = filterHasSelectedChildren(checkedLabelPaths, ancestorPath, label);
      if (!hasCheckedChildren) setIsExpanded(false);
    }

    toggleFilter(pathLabels, value);
  };

  const onToggleAccordion = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.target instanceof HTMLInputElement) return; // Overrides Base UI's Checkbox click dispatcher
    setIsExpanded((current) => !current);
  };

  const labelClickBehaviour = hasChildren
    ? { onClick: (event: MouseEvent) => event.stopPropagation(), noClickLabel: true }
    : { onClick: undefined, noClickLabel: false };

  return (
    <li className="py-4 group">
      <button type="button" className="w-full flex flex-row items-center" onClick={onToggleAccordion}>
        <Checkbox
          checked={checked === true}
          indeterminate={checked === "indeterminate"}
          onCheckedChange={onCheckedChange}
          onClick={labelClickBehaviour.onClick}
          noClickLabel={labelClickBehaviour.noClickLabel}
          className="flex-1 gap-4! items-start!"
        >
          <span className="text-base text-text-primary font-medium leading-5">{firstCase(label.value)}</span>
        </Checkbox>
        {hasChildren && (
          <ChevronDown
            size={16}
            className={joinTailwindClasses("shrink-0 -p-1 text-elem-icon transition duration-300", isExpanded && "rotate-180")}
          />
        )}
      </button>
      {showAppliedFilters && <AppliedFilters ancestorPath={pathLabels} className="pl-8 mt-4" />}
      {isExpanded && label.children.length > 0 && (
        <div className="ml-9 pt-6">
          <SearchFilterLevel ancestorPath={pathLabels} labels={label.children} level={level + 1} />
        </div>
      )}
      <div className="relative -bottom-4 h-px ml-9 bg-border-light group-last:hidden" />
    </li>
  );
};
