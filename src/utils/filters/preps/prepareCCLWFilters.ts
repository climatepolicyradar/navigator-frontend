import sortBy from "lodash/sortBy";

import themeConfig from "@/cclw/config";
import { TFiltersGroupPrep } from "@/types";

export const prepareCCLWFilters: TFiltersGroupPrep = (rootLabels) =>
  sortBy(rootLabels, (label) => themeConfig.searchCategories.findIndex((category) => category === label.value));
