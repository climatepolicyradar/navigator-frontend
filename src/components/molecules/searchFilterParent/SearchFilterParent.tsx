import { ChevronDown } from "lucide-react";
import { MouseEvent, useContext, useState } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { FiltersContext } from "@/context/FiltersContext";
import { TCheckboxState, TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { filterHasSelectedChildren } from "@/utils/filters/filterHasSelectedChildren";
import { getFilterPathLabels } from "@/utils/filters/filterPaths";
import { getFilterStatus } from "@/utils/filters/getFilterStatus";
import { getLabelDisplay } from "@/utils/filters/getLabelDisplay";
import { joinTailwindClasses } from "@/utils/tailwind";

interface IProps {
  ancestorPath: TFilterPathLabel[];
  label: TNestedSearchLabel;
  level: number;
  defaultOpen?: boolean;
}

export const SearchFilterParent = ({ ancestorPath, defaultOpen = false, label, level }: IProps) => {
  const { checkedLabelPaths, toggleFilter } = useContext(FiltersContext);
  const [isExpanded, setIsExpanded] = useState(defaultOpen);

  const isGroupLabel = label.type === "group";
  const pathLabels = isGroupLabel ? [...ancestorPath] : getFilterPathLabels(label, ancestorPath);
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

  const { name, subtitle } = getLabelDisplay(label, ancestorPath);

  return (
    <>
      <div className={joinTailwindClasses("relative h-px bg-border-light", !isGroupLabel && "ml-9")} />
      <li className="group">
        <button type="button" className="w-full flex flex-row items-start" onClick={onToggleAccordion}>
          {isGroupLabel ? (
            <div className="flex-1 flex flex-col gap-1 items-start">
              <span className="text-base text-text-primary text-start font-medium leading-5">{name}</span>
              {subtitle && <span className="text-sm text-text-secondary font-normal leading-5">{subtitle}</span>}
            </div>
          ) : (
            <Checkbox
              checked={checked === true}
              indeterminate={checked === "indeterminate"}
              onCheckedChange={onCheckedChange}
              onClick={labelClickBehaviour.onClick}
              noClickLabel={labelClickBehaviour.noClickLabel}
              className="flex-1 gap-4! items-start!"
            >
              <span className="text-base text-text-primary font-medium leading-5">{name}</span>
              {subtitle && <span className="text-sm text-text-secondary font-normal leading-5">{subtitle}</span>}
            </Checkbox>
          )}
          {hasChildren && (
            <ChevronDown
              size={16}
              className={joinTailwindClasses("shrink-0 -p-1 mt-0.5 text-elem-icon transition duration-300", isExpanded && "rotate-180")}
            />
          )}
        </button>
        {isExpanded && label.children.length > 0 && (
          <div className={joinTailwindClasses("pt-4", !isGroupLabel && "ml-9")}>
            <SearchFilterLevel ancestorPath={pathLabels} labels={label.children} level={level + 1} />
          </div>
        )}
      </li>
    </>
  );
};
