import sortBy from "lodash/sortBy";

import { TFiltersGroupPrep } from "@/types";

const ORDERED_ALLOWED_CATEGORIES = ["UN submission", "Law", "Policy"];

export const prepareCCLWFilters: TFiltersGroupPrep = (rootLabels) =>
  sortBy(
    rootLabels.filter((label) => ORDERED_ALLOWED_CATEGORIES.includes(label.value)),
    (label) => ORDERED_ALLOWED_CATEGORIES.findIndex((category) => category === label.value)
  );
