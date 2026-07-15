import { ChevronDown } from "lucide-react";
import { MouseEvent, useContext, useState } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
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
}

export const SearchFilter = ({ ancestorPath, label }: IProps) => {
  const { checkedLabelPaths, toggleFilter } = useContext(FiltersContext);
  const [isOpen, setIsOpen] = useState(false);

  const pathLabels = [getFilterPathLabel(label), ...ancestorPath];
  const checked = getFilterStatus(pathLabels, checkedLabelPaths);

  const hasChildren = label.children.length > 0;

  const onCheckedChange = (value: TCheckboxState) => {
    if (value === true) setIsOpen(true);
    if (value === false) {
      const hasCheckedChildren = filterHasSelectedChildren(checkedLabelPaths, ancestorPath, label);
      if (!hasCheckedChildren) setIsOpen(false);
    }

    toggleFilter(pathLabels, value);
  };

  const onToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (event.target instanceof HTMLInputElement) return; // Overrides Base UI's Checkbox click dispatcher
    setIsOpen((current) => !current);
  };

  return (
    <li>
      <button type="button" className="w-full flex flex-row items-center" onClick={onToggle}>
        <Checkbox
          checked={checked === true}
          indeterminate={checked === "indeterminate"}
          onCheckedChange={onCheckedChange}
          onClick={(event) => event.stopPropagation()}
          noClickLabel
          className="flex-1"
        >
          {firstCase(label.value)}
        </Checkbox>
        {hasChildren && <ChevronDown size={16} className={joinTailwindClasses("text-elem-icon", isOpen && "rotate-180")} />}
      </button>
      {hasChildren && isOpen && <SearchFilterLevel ancestorPath={pathLabels} labels={label.children} indented />}
    </li>
  );
};
