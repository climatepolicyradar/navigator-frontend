import sortBy from "lodash/sortBy";

import themeConfig from "@/cpr/config";
import { TFiltersGroupPrep } from "@/types";
import { filterLabelCategories } from "@/utils/filters/preps/filterLabelCategories";

export const prepareCPRFilters: TFiltersGroupPrep = (rootLabels) => sortBy(filterLabelCategories(rootLabels, themeConfig), "value");
