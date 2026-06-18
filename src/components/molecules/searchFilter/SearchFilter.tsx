import { useContext } from "react";

import { Checkbox } from "@/components/atoms/checkbox/Checkbox";
import { SearchFilterLevel } from "@/components/organisms/searchFilterLevel/SearchFilterLevel";
import { FiltersContext } from "@/context/FiltersContext";
import { TFilterPathLabel, TNestedSearchLabel } from "@/types";
import { getFilterPathLabel } from "@/utils/filters/filterPaths";

interface IProps {
  ancestorPath: TFilterPathLabel[];
  label: TNestedSearchLabel;
}

export const SearchFilter = ({ ancestorPath, label }: IProps) => {
  const { toggleFilter } = useContext(FiltersContext);

  const pathLabels = [getFilterPathLabel(label), ...ancestorPath];

  return (
    <li>
      <Checkbox onCheckedChange={(value) => toggleFilter(pathLabels, value === true)}>{label.value}</Checkbox>
      {label.children.length > 0 && <SearchFilterLevel ancestorPath={pathLabels} labels={label.children} indented />}
    </li>
  );
};
