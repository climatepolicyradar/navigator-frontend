import sortBy from "lodash/sortBy";

import { TFiltersGroupPrep } from "@/types";

export const prepareCPRFilters: TFiltersGroupPrep = (rootLabels) =>
  sortBy(
    rootLabels.filter((label) => label.value !== "Litigation"),
    "value"
  );
