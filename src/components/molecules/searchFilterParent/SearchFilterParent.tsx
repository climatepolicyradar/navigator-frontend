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
  level: number;
}

export const SearchFilterParent = ({ ancestorPath, label, level }: IProps) => {
  const { checkedLabelPaths, toggleFilter } = useContext(FiltersContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const isGroupLabel = label.type === "group";
  const pathLabels = isGroupLabel ? [...ancestorPath] : [getFilterPathLabel(label), ...ancestorPath];
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
      <div className={joinTailwindClasses("relative -top-4 h-px bg-border-light", !isGroupLabel && "ml-9")} />
      <button type="button" className="w-full flex flex-row items-center" onClick={onToggleAccordion}>
        {isGroupLabel ? (
          <span className="flex-1 text-base text-text-primary text-start font-medium leading-5">{firstCase(label.value)}</span>
        ) : (
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
        )}
        {hasChildren && (
          <ChevronDown
            size={16}
            className={joinTailwindClasses("shrink-0 -p-1 text-elem-icon transition duration-300", isExpanded && "rotate-180")}
          />
        )}
      </button>
      {isExpanded && label.children.length > 0 && (
        <div className={joinTailwindClasses("pt-6", !isGroupLabel && "ml-9")}>
          <SearchFilterLevel ancestorPath={pathLabels} labels={label.children} level={level + 1} />
        </div>
      )}
    </li>
  );
};
