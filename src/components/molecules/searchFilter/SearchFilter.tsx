import { ChevronDown } from "lucide-react";
import { MouseEvent, useContext, useMemo, useState } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { FiltersContext } from "@/context/FiltersContext";
import { FiltersLookupContext } from "@/context/FiltersLookupContext";
import { TCheckboxState, TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { filterHasSelectedChildren } from "@/utils/filters/filterHasSelectedChildren";
import { getFilterPathLabels, getLabelPathSignature } from "@/utils/filters/filterPaths";
import { getFilterStatus } from "@/utils/filters/getFilterStatus";
import { getLabelDisplay } from "@/utils/filters/getLabelDisplay";
import { joinTailwindClasses } from "@/utils/tailwind";
import { addSubStringHighlights } from "@/utils/text/addSubStringHighlights";

interface IProps {
  ancestorPath: TFilterPathLabel[];
  label: TNestedSearchLabel;
  level: number;
}

export const SearchFilter = ({ ancestorPath, label, level }: IProps) => {
  const { checkedLabelPaths, toggleFilter } = useContext(FiltersContext);
  const { searchTerm, matchingLabelPathSignatures } = useContext(FiltersLookupContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const pathLabels = useMemo(() => getFilterPathLabels(label, ancestorPath), [ancestorPath, label]);
  const checked = getFilterStatus(pathLabels, checkedLabelPaths);

  const isFiltered = searchTerm !== "";
  const isVisible: boolean = useMemo(() => {
    if (!isFiltered) return true;
    const labelPathSignature = getLabelPathSignature(pathLabels);
    const signatureMatches = matchingLabelPathSignatures.some(
      (signature) => signature.startsWith(labelPathSignature + "/") || signature === labelPathSignature
    );
    return signatureMatches;
  }, [isFiltered, matchingLabelPathSignatures, pathLabels]);
  if (!isVisible) return null;

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

  const labelName = getLabelDisplay(label, ancestorPath).name;
  const labelValue = isFiltered ? addSubStringHighlights(labelName, searchTerm, "bg-yellow-200") : labelName;

  return (
    <li>
      <button type="button" className="w-full flex flex-row items-center" onClick={onToggleAccordion}>
        <Checkbox
          checked={checked === true}
          indeterminate={checked === "indeterminate"}
          onCheckedChange={onCheckedChange}
          onClick={labelClickBehaviour.onClick}
          noClickLabel={labelClickBehaviour.noClickLabel}
          className="flex-1"
        >
          <span>{labelValue}</span>
        </Checkbox>
        {!isFiltered && hasChildren && <ChevronDown size={16} className={joinTailwindClasses("text-elem-icon", isExpanded && "rotate-180")} />}
      </button>
      {hasChildren && (isExpanded || isFiltered) && (
        <SearchFilterLevel ancestorPath={pathLabels} labels={label.children} level={level + 1} indented />
      )}
    </li>
  );
};
