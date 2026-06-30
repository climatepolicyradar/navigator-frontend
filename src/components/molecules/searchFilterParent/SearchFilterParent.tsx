import { ChevronDown } from "lucide-react";
import { MouseEvent, useContext, useState } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { FiltersContext } from "@/context/FiltersContext";
import { TCheckboxState, TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";
import { getFilterStatus } from "@/utils/filters/getFilterStatus";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  ancestorPath: TFilterPathLabel[];
  label: TNestedSearchLabel;
}

export const SearchFilterParent = ({ ancestorPath, label }: IProps) => {
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

  return (
    <li className="py-4 group">
      <Checkbox checked={checked === true} indeterminate={checked === "indeterminate"} onCheckedChange={onToggleCheckbox} className="flex-1 gap-4!">
        <div className="w-full flex items-center justify-between gap-1">
          <span className="text-base text-text-primary font-medium leading-5">{label.value}</span>
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
