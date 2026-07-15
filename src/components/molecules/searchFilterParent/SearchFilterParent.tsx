import { ChevronDown } from "lucide-react";
import { MouseEvent, useContext, useState } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { AppliedFilters } from "@/components/molecules/appliedFilters/AppliedFilters";
import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { FILTER_DISPLAY } from "@/constants/filters";
import { FiltersContext } from "@/context/FiltersContext";
import { TCheckboxState, TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";
import { getFilterStatus } from "@/utils/filters/getFilterStatus";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  ancestorPath: TFilterPathLabel[];
  label: TNestedSearchLabel;
  showAppliedFilters?: boolean;
}

export const SearchFilterParent = ({ ancestorPath, label, showAppliedFilters }: IProps) => {
  const { checkedLabelPaths, toggleFilter } = useContext(FiltersContext);
  const [expanded, setExpanded] = useState(false);

  const pathLabels = [getFilterPathLabel(label), ...ancestorPath];
  const checked = getFilterStatus(pathLabels, checkedLabelPaths);

  const onToggleCheckbox = (value: TCheckboxState) => {
    setExpanded(value === true);
    toggleFilter(pathLabels, value);
  };

  const onToggleAccordion = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setExpanded((current) => !current);
  };

  const filterDescription = FILTER_DISPLAY[label.id]?.description;

  return (
    <li className="py-4 group">
      <Checkbox
        checked={checked === true}
        indeterminate={checked === "indeterminate"}
        onCheckedChange={onToggleCheckbox}
        className="flex-1 gap-4! items-start!"
      >
        <div className="w-full flex items-start justify-between gap-1">
          <div>
            <span className="text-base text-text-primary font-medium leading-5">{label.value}</span>
            {filterDescription && <span className="block mt-1 text-sm text-text-secondary font-normal leading-5">{filterDescription}</span>}
            {showAppliedFilters && <AppliedFilters ancestorPath={pathLabels} className="mt-2" />}
          </div>
          <button role="button" onClick={onToggleAccordion} className="-m-1 p-1">
            <ChevronDown
              size={16}
              className={joinTailwindClasses("shrink-0 -p-1 text-elem-icon transition duration-300", expanded && "rotate-180")}
            />
          </button>
        </div>
      </Checkbox>
      {expanded && label.children.length > 0 && (
        <div className="ml-9 pt-6">
          <SearchFilterLevel ancestorPath={pathLabels} labels={label.children} />
        </div>
      )}
      <div className="relative -bottom-4 h-px ml-9 bg-border-light group-last:hidden" />
    </li>
  );
};
