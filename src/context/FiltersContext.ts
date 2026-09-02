import { createContext } from "react";

import { TCheckboxState, TFilterPathLabel } from "@/types";

export type TToggleFilterCallback = (labelPath: TFilterPathLabel[], checked: TCheckboxState) => void;
export type TDateRange = [number, number] | null;

interface IFiltersContext {
  appliedDateRange: TDateRange;
  checkedLabelPaths: TFilterPathLabel[][];
  clearFilters: () => void;
  labelValues: Record<string, string>;
  setDateRange: (dateRange: TDateRange) => void;
  toggleFilter: TToggleFilterCallback;
}

export const FiltersContext = createContext<IFiltersContext>({
  appliedDateRange: null,
  checkedLabelPaths: [],
  clearFilters: () => {},
  labelValues: {},
  setDateRange: () => {},
  toggleFilter: () => {},
});
