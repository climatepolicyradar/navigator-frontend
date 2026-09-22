import { TFiltersGroupPrep } from "@/types";

export const prepareCPRFilters: TFiltersGroupPrep = (rootLabels) => rootLabels.filter((label) => label.value !== "Litigation");
