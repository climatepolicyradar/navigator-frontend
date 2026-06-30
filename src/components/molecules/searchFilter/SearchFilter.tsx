import { useContext } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { FiltersContext } from "@/context/FiltersContext";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";
import { getFilterStatus } from "@/utils/filters/getFilterStatus";

interface IProps {
  ancestorPath: TFilterPathLabel[];
  label: TNestedSearchLabel;
}

export const SearchFilter = ({ ancestorPath, label }: IProps) => {
  const { checkedLabelPaths, toggleFilter } = useContext(FiltersContext);

  const pathLabels = [getFilterPathLabel(label), ...ancestorPath];
  const checked = getFilterStatus(pathLabels, checkedLabelPaths);

  return (
    <li>
      <Checkbox checked={checked === true} indeterminate={checked === "indeterminate"} onCheckedChange={(value) => toggleFilter(pathLabels, value)}>
        {label.value}
      </Checkbox>
      {label.children.length > 0 && <SearchFilterLevel ancestorPath={pathLabels} labels={label.children} indented />}
    </li>
  );
};
