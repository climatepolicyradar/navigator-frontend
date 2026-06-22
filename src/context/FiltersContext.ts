import { createContext } from "react";

import { TFilterPathLabel } from "@/types";

export type TToggleFilterCallback = (labelPath: TFilterPathLabel[], checked: boolean) => void;

interface IFiltersContext {
  checkedLabelPaths: TFilterPathLabel[][];
  resetFilters: () => void;
  toggleFilter: TToggleFilterCallback;
}

export const FiltersContext = createContext<IFiltersContext>({
  checkedLabelPaths: [],
  resetFilters: () => {},
  toggleFilter: () => {},
});
