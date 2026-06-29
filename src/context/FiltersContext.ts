import { createContext } from "react";

import { TCheckboxState, TFilterPathLabel } from "@/types";

export type TToggleFilterCallback = (labelPath: TFilterPathLabel[], checked: TCheckboxState) => void;

interface IFiltersContext {
  checkedLabelPaths: TFilterPathLabel[][];
  clearFilters: () => void;
  toggleFilter: TToggleFilterCallback;
}

export const FiltersContext = createContext<IFiltersContext>({
  checkedLabelPaths: [],
  clearFilters: () => {},
  toggleFilter: () => {},
});
