import { createContext } from "react";

import { TCheckboxState, TFilterPathLabel } from "@/types";

export type TToggleFilterCallback = (labelPath: TFilterPathLabel[], checked: TCheckboxState) => void;
export type TDateRange = [number, number] | null;

interface IFiltersContext {
  checkedLabelPaths: TFilterPathLabel[][];
  clearFilters: () => void;
  dateRange: TDateRange;
  labelValues: Record<string, string>;
  setDateRange: (dateRange: TDateRange) => void;
  toggleFilter: TToggleFilterCallback;
}

export const FiltersContext = createContext<IFiltersContext>({
  checkedLabelPaths: [],
  clearFilters: () => {},
  dateRange: null,
  labelValues: {},
  setDateRange: () => {},
  toggleFilter: () => {},
});
