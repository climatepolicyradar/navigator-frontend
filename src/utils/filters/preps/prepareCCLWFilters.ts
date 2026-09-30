import sortBy from "lodash/sortBy";

import themeConfig from "@/cclw/config";
import { TFiltersGroupPrep } from "@/types";
import { filterLabelCategories } from "@/utils/filters/preps/filterLabelCategories";

export const prepareCCLWFilters: TFiltersGroupPrep = (rootLabels) =>
  sortBy(filterLabelCategories(rootLabels, themeConfig), (label) => themeConfig.searchCategories.findIndex((category) => category === label.value));
